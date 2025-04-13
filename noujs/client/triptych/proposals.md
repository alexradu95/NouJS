Support PUT, PATCH, and DELETE in HTML Forms
Authors
Alexander Petros (contact@alexpetros.com)
Carson Gross (carson@bigsky.software)
Date Created
August 17, 2024
Last Updated
November 10, 2024
Issue Tracker
WHATWG Issue #3577
Status
Published
Summary
Goals
Proposed Changes
Sample Usage in Resource Lifecycle
Creating A Resource
Updating A Resource
Deleting A Resource
Technical Specification
Rendering
Redirection
Body Content
Caching
Cross-Origin Resource Sharing (CORS)
Refresh Behavior
Security Profile
Client Capabilities
Opportunity For a Pit of Success
Completing REST
REST in Theory
REST in Practice
The Limits of Scripting
Ecosystem Demand
The Hidden Input Hack
Ad-hoc URI Semantics
REST Support in Server Frameworks
REST Support in Client Libraries
Usage of Non-GET & Non-POST Methods
Common Patterns
Logout
Application Server Permissions
Alternatives and Additions
Custom Method Attribute
Omit PATCH
Allow for DELETE request bodies
Update History
Footnotes
Summary
A proposal for adding PUT, PATCH, and DELETE support to HTML forms.

Proposal 1/3 in the Triptych Proposals.

Goals
PUT, PATCH, and DELETE support in forms should:

be the path of least friction for developing RESTful web services
fit seamlessly within existing form semantics
integrate with existing servers and frameworks that support those methods
not introduce new security considerations
Proposed Changes
New values for the form method attribute:

PUT - makes the form issue a PUT request
PATCH - makes the form issue a PATCH request
DELETE - makes the form issue a DELETE request
All new method keywords are case insensitive. Existing form controls (e.g. action, enctype) should operate identically.

Sample Usage in Resource Lifecycle
This section demonstrates how PUT and DELETE methods are necessary for managing the lifecycle of a resource. We use as an example a hypothetical hotel reservation service, in which users have the ability to book hotel rooms.
All examples in this section assume that the host origin is https://example.com.

Creating A Resource
First, the user makes a reservation using a traditional POST form:[1]

<form action="/reservations" method="POST">
  <input type="text" name="name">
  <input type="date" name="check-in">
  <input type="date" name="check-out">
  <input type="checkbox" name="has-pets">
  <button>Submit</button>
</form>
The browser will send the following HTTP request:
POST /reservations HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
...
name=Alex%20Petros&check-in=2024-12-01&check-out=2024-12-02&has-pets=on
And the server responds with a redirect to the newly-created reservation resource:[2]
HTTP/1.1 303 SEE OTHER
Location: /reservations/123
Updating A Resource
At the reservation page, the user is presented with two forms. The first one allows them to adjust their reservation:

<form action="/reservations/123" method="PUT">
  <input type="text" name="name" value="Alex Petros">
  <input type="date" name="check-in" value="2024-12-01">
  <input type="date" name="check-out" value="2024-12-02">
  <input type="checkbox" name="has-pets" checked>
  <button>Submit</button>
</form>
This new form offers the same controls as the POST form, but with some key differences:[3]
The action has changed from /reservations to /reservations/123
The method has changed from POST to PUT
The forms are pre-filled with the values saved at the server.
If the user changes the check-out date to 2024-12-03, the browser will send the following request:

PUT /reservations/123 HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
...
name=Alex%20Petros&check-in=2024-12-01&check-out=2024-12-03&has-pets=on
The server can then choose to either send back a new page or redirect to one.
Deleting A Resource
The second form on the reservation page allows the user to delete their reservation:[4]
<form action="/reservations/123" method="DELETE">
  <button>Delete Reservation</button>
</form>
Clicking "Delete Reservation" would result in the following HTTP request:
DELETE /reservations/123 HTTP/1.1
Host: example.com
And the server could choose to either send a delete confirmation page, or redirect elsewhere.
Technical Specification
Rendering
If the response status code is not a redirection code (300-399), the browser should display the body of the response in the page, exactly the same way it would for the response of a POST form. It should likewise update the page URL and history.
Browsers should identically render the response content for all non-redirection codes; we do not propose any special behavior for codes like 201 (Created) or or 500 (Internal Server Error). This aligns with current browser behavior.

Redirection
For PUT, PATCH, and DELETE requests, if the server responds with a 301, 302, or 307 status code, the browser should perform a subsequent request with the same HTTP method; if the server responds with a 303 status code, the browser should perform a subsequent request with the GET method.[5] This resolves a blocker for the original Firefox beta implementation.[6]

If the response redirects to a server of the same origin, the browser should directly issue the request. For behavior when the response redirects to a server of a different origin, see Security Profile.

Body Content
PUT and PATCH forms should send identical content to their POST equivalents.[7] [8] Server frameworks that support PUT and PATCH handle their bodies identically to POST bodies; the vast majority of servers will support the new feature out of the gate.[9]

DELETE forms should format their content as URL parameters, like GET forms. While both GET and DELETE body semantics are technically undefined, including content in the request body is somewhat discouraged by the spec.[10] Therefore, forms with method=DELETE should encode their inputs as part the URI, emulating the behavior of forms with no method, or method=GET.[11]

Caching
PUT, PATCH, and DELETE requests are unsafe (not read-only), and therefore can never be cached.

PATCH responses are technically cacheable in the same way that POST responses are: if certain information is explicitly provided, subsequent GET requests may use the cached PATCH response to represent that resource.[12] Browsers that implement this behavior for POST requests should do so for PATCH requests, although the spec notes that the overwhelming majority of cache implementations do not.[13]

PUT and DELETE responses are never cacheable.[14]

Cross-Origin Resource Sharing (CORS)
For same-origin requests, the browser should directly issue the request. For cross-origin requests, the browser should do the following:

Issue a CORS preflight request to the URI at the action attribute.
If the server responds indicating that the request is not allowed, throw an error (visible to the user, in the same manner as an infinite redirect or bad certificate)
Otherwise, issue the request.
If the server responds with a redirect, issue a new CORS request
If the server responds indicating that the request is allowed, navigate to the page
If the server responds indicating that the request is not allowed, throw an error
If the server responds with a redirect, go to step 4
Otherwise, navigate to the page
The behavior where the browser issues additional CORS requests if the server responds with a redirect is chosen to match the existing behavior in the fetch spec. [15]

Applying CORS to navigation was an implementation blocker for quite some time, as no precedent previously existed for this behavior.[16] Progress in Private Network Access draft specification, however, has provided a concurrent justification for revisiting it.[17] As such, this proposal models its algorithm to re-use the work from that proposal and reduce implementation complexity accordingly.

It's possible that new, navigation-specific CORS headers could be added as well.

Refresh Behavior
For PATCH requests, which are not idempotent, the user agent should behave as it does currently, asking the user for confirmation and warning that it may cause the data to be re-submitted.

For PUT and DELETE requests, which are idempotent, the user agent should resubmit the request. This allows servers to take advantage of the method semantics and create forms that users on unreliable connections can feel confident re-submitting.

Security Profile
Client Capabilities
First and foremost, new browser features must not expose existing servers or users to new vulnerabilities, so adding new CORS-safelisted methods or headers is out of the question. Fortunately, there is no need to do so.

PUT, PATCH, and DELETE forms only make available to HTML a highly useful subset of what is already available to the web page, via JavaScript. Nothing is proposed that can't be accomplished currently with fetch and FormData.

Technically, this does increase the capabilities of clients that that have scripting disabled. The overwhelming majority of browser users, however, especially the ones most vulnerable to malicious websites, have scripting enabled. Servers obviously cannot build webpages that are only secure for users with scripting disabled, so this does not change the security profile of the server.

The only HTML control that this proposal alters is the form's method attribute. Because the only two supported methods, GET and POST, have such different purposes, it is highly unlikely that authors are setting this attribute dynamically; it is even less likely that authors are setting it dynamically with un-escaped user-generated input, and relying on the browser's incomplete implementation of HTTP methods to protect against XSRF. The spec has never guaranteed that these would be the only two methods, and it's hard to imagine a practical use that would lead an author to that implementation.

Opportunity For a Pit of Success
The addition of CORS-restricted methods to HTML forms provides a massive opportunity to move developers onto a more secure pattern for building web applications. PUT, PATCH, and DELETE requests are more secure, by default, than POST requests, because they will never be issued to a cross-origin server unless that server explicitly permits them.[18] Because POST is the only unsafe method currently available to HTML forms, the introduction of PUT and DELETE necessarily displaces usage of POST methods, reducing the number of webforms that are vulnerable to CSRF due to backwards compatibility concerns.[19]

In this manner, CORS restrictions can be leveraged to deepen the web security pit of success. Sites that make no cross-origin requests are easier to secure than sites that do.[20] Sites that use REST verbs properly are easier to secure than sites that don't.[21] Web forms that make using REST verbs trivial for same-site requests—especially REST verbs that are not safelisted by CORS—incentivize the simplest, most secure patterns by also making them the easiest to implement.

Completing REST
In 2000, Roy Fielding published a PhD dissertation in which he introduced the Representational State Transfer (REST) architectural style for distributed hypermedia systems. While these principles were used to guide the early development of the World Wide Web, they are often badly misunderstood.[22]
Despite the misconceptions, REST remains the most powerful conceptual tool for building durable hypermedia applications. In this section, we make the case for how better method support in HTML can drive adoption of REST priciples and dramatically improve the median web application as a result.

REST in Theory
In the dissertation that defines REST, Roy Fielding includes HTTP methods among the core interface constraints of REST—specifically the constraint that messages need to be self-describing.[23] He does not, however, address which methods are necessary.[24] His main concern is that the name of the method should not affect the parsing of the HTTP request, as that would require out-of-band agreement on method semantics and limit the extensibility of the method field.[25]

Fielding actually appears to be somewhat ambivalent about whether the user agent should have any understanding of method semantics. In 2008, he writes:

You don't get to decide what POST means — that is decided by the resource. Its purpose is supposed to be described in the same context in which you found the URI that you are posting to.[26]
That GET, POST, and PUT have semantic meaning outside the context of the application is a secondary concern; the primary obligation of the client is to allow the hypermedia API to describe itself, and then faithfully execute that description.[27] The HTML form element's transformation of any non-GET, non-POST method into a GET violates this principle.[28]
We do not propose that HTML execute arbitrary HTTP methods specified in the form's method attribute, although that would fit nicely within the REST guidelines by allowing web APIs to freely self-describe across an already-available dimension.[29] Instead, we simply urge that HTML support the relevant, existing HTTP methods, which are so useful that they are universally-supported by servers in spite of their absence from the HTML standard.

REST in Practice
HTTP methods have become more central to the developer community's conception of REST than Fielding perhaps intended, and are one of its better-understood concepts. In Jeremy Richardson's Maturity Heuristic, later dubbed the "Richardson Maturity Model" by Martin Fowler, proper use of HTTP methods is one of the three levels that determine how well an application adheres to REST principles.[30]

Using HTTP
Using resource URIs
Using HTTP verbs (methods)
Responding with hypermedia
The increased salience of HTTP methods to REST is not a perversion of the concept, but a practical evolution of it, born from real-world use. Aspirational REST adherents have discovered that it is much easier to uphold a consistent representation of a resource (via URIs) when you have a standardized semantic to describe how the enclosed resource is to be modified.

For instance, this overview is from the first API tutorial in the latest ASP.NET Core documentation:[31]

API	Description	Request body	Response body
GET /api/todoitems	Get all to-do items	None	Array of to-do items
GET /api/todoitems/{id}	Get an item by ID	None	To-do item
POST /api/todoitems	Add a new item	To-do item	To-do item
PUT /api/todoitems/{id}	Update an existing item  	To-do item	None
DELETE /api/todoitems/{id}    	Delete an item    	None	None
This how most developers understand REST: a service is RESTful if it uses methods and URIs to describe what action you're taking on what resource. But if you look closely, you'll notice that it's not REST: the API returns JSON data, not hypermedia. The popular conception of REST is stuck at Level 2 of the Richardson Maturity Model.

Developers choose to build APIs with the standardized method grammar—in spite of missing HTML support—because it's simpler. An API that supports PUT /users/123 and DELETE /users/123 is easier to describe and code than a POST /users/123 API whose body semantics alter how it processes the enclosed resource.

The usefulness of methods as an HTTP semantic—a priori to the semantics of the methods themselves—is so self-evident that the hypertext transfer protocol has long standardized a bunch of additional methods; all that remains is for the dominant hypertext markup to support them.[32]

The Limits of Scripting
REST is an enduring paradigm that suites a wide variety of web applications, and developers today have a number of good libraries to choose from if they wish to implement it. But even a client-loaded library with the perfect interface can never replace the functionality or durability of an official implementation.

Most libraries that implement REST primitives use them with partial page replacement. This is largely due to demand in the developer ecosystem for partial page replacement, but it masks an important limitation: JavaScript cannot modify browser navigation primitives.[33] A form that makes POST request "navigates" to that URL, displaying the results on the page and resetting the JavaScript environment; no JavaScript-based implementation of the PUT method can perform the same task.[34] While partial page replacement is useful for highly interactive applications, full page navigation is a much more accessible and secure paradigm.[35]

Given HTML's tremendous backwards- and forwards-compatibility guarantees, its capabilities guide the design of durable interactive applications. For instance, the vast majority of Wikipedia's functionality can be described with hypertext primitives—including its relatively limited interactivity.[36] Not only can you browse Wikipedia with JavaScript disabled, you can create an account and edit pages too; with scripting enabled, editing is augmented by a rich-text editor, but in most other respects the experience is close to identical.

Many applications that thrive on the web have more complicated resource lifecycles than Wikipedia, like banking, travel bookings, and social media. The new lifecycle methods would make it possible for those applications to built their interactivity in a hypertext-driven style, and take full advantage of the browser's reliability, security, and longevity as an application platform.

Ecosystem Demand
Lacking proper browser support, developers still consider method semantics important enough to their API design that they come up with ad-hoc methods to achieve the same result.
The Hidden Input Hack
The most common way that developers compensate for the lack of proper HTTP method support is to include a hidden input that overrides the method. [37]

<form method="post" action="/users/123"...>
  <input type="hidden" name="_method" value="put">
  ...
</form>

<form method="post" action="/users/123"...>
  <input type="hidden" name="_method" value="delete">
  ...
</form>
This would be a Level 1 on the Richardson Maturity Model. The URIs consistently identify a resource (user/123), but the method is always POST, so the verbs aren't in use.

This pattern has a number of drawbacks that would be rectified by proper PUT, PATCH, and DELETE support:[38]

Unlike POST, PUT and DELETE are idempotent, which gives the user agent more leeway to recover from network failures
HTTP methods are typically logged while HTTP bodies are not; services that break up their unsafe requests across POST, PUT, and DELETE have a smaller surface to debug than ones where all unsafe request are tunneled through POST.
HTTP methods are a powerful filtering tool for debugging across the stack—server logs, application logs, and the browser network tab.
Routing is fundamental to server logic, and including an additional variable for routing dramatically simplifies the server logic that would otherwise have to compensate by performing additional routing imperatively.
PUT and DELETE do not have the same CORS exemptions that POST does, making them more secure for user agent (discussed in CORS)
Ad-hoc URI Semantics
Another workaround is to encode the method semantics straight into the URI.

<form method="post" action="/users/123/put"...>
  ...
</form>

<form method="post" action="/users/123/delete"...>
  ...
</form>
This actually resolves some of the operational issues with the hidden input hack. The different actions are visible to the transport layer (although in a slightly harder-to-parse location than the proper method field), and server routers can easily declare separate handlers for each action.

But it is certainly not REST. In fact, it regresses on the Richardson Maturity Model from even the hidden input hack, all the way back down to 0. Where the hidden input at least used URIs to identify resources, now the URIs don't even represent resources anymore; they represent a combination of resource and method, mixing the semantics of both. The problem immediately becomes apparent when you try to add additional sub-resources after /users/123: sometimes what comes after the 123 is an action, and sometimes it's a sub-resource. This is a hassle to code, and it's a hassle to understand.

The overall impact is to unmoor the application from any universal semantics. The standardized HTTP methods guide the developer to a clear and consistent pattern. If the developer is not presented with a consistent set of common verbs for common tasks, they are liable to invent their own. Why shouldn't /put be /create, or /delete be /remove?[39]

The obvious smell of this pattern, when placed next to the actual HTTP methods, leads developers to conclude, correctly, that the missing methods limitation is endogenous to HTML, and the solution is to augment or abandon HTML rather than throw out URI semantics along with them.

REST Support in Server Frameworks
Support for all HTTP methods is widespread in server side frameworks. Currently, this support is mainly used for JSON-based APIs, since JavaScript-based network interactions via technologies like XmlHttpRequest (xhr) or fetch() allow JavaScript developers to access these HTTP methods.

Below is a table of some major server side frameworks in various programming langauges, and their support for HTTP methods.

Language	Framework	HTTP Method Support
JavaScript	Express	All HTTP Methods
Next.js	All HTTP Methods
Astro	All HTTP Methods
Python	Flask	All HTTP Methods
Django	All HTTP Methods
.NET	ASP.NET	All HTTP Methods
Java	Spring Boot	All HTTP Methods
Javalin	All HTTP Methods
Go	Core HTTP Library	All HTTP Methods
PHP	Laravel	All HTTP Methods
REST Support in Client Libraries
Support for all HTTP methods is also widespread in client-side frameworks. Interestingly, this support is increasingly used for HTML-based APIs, in addition to JSON-based APIs, indicating that there is demand for a full implementation of HTTP methods in HTML.

Below is a table of client side frameworks that use HTML as a network format, as well as their support for the various HTTP.

Framework	HTTP Method Support
htmx	All HTTP Methods
Unpoly	All HTTP Methods
Alpine-Ajax	All HTTP Methods
pjax	All HTTP Methods
Hotwire Turbo	All HTTP Methods
Usage of Non-GET & Non-POST Methods
While the above table establishes the general support for the full gamut of HTTP methods, it does not establish their usefulness web developers. In order to get a feel for that, we can search Github for use of the following htmx attributes: hx-put, hx-patch & hx-delete, which are used to issue the HTTP PUT, PATCH and DELETE methods respectively.

Below is a table of the results of these searches:

Attribute	Count	% of hx-get	% of hx-post
hx-get	35.2k	100%	-
hx-post	22.5k	64%	100%
hx-put	3.8k	11%	17%
hx-patch	1.2k	3%	5%
hx-delete	6.5k	18%	29%
You can see that there is widespread use of the three additional methods in htmx-based applications, particularly hx-put and hx-delete. It is worth noting the popularity of the DELETE method in HTML-based web applications. This is because it allows web developers to issue two different methods to the same URL. A web developer can use POST to /reservations/ to create a new reservation and a POST to /reservations/123 to update an existing reservation (even if they would prefer to issue a PUT or PATCH) but must create a separate end-point (or use another workaround) to delete that reservation.

With the addition of the DELETE method, web developers can follow the natural, resource-oriented URL pattern.

Common Patterns
Logout
One common web application pattern that is not well-supported in HTML due to the lack of additional HTTP methods beyond GET and POST is a logout flow. It is common in many web applications to have some sort of login functionality, creating a session for a user where their identity is established for future requests. Once a user has logged in, web applications typically allow users to then choose to log out of the web application. This is typically done in one of two ways:

The user clicks a link that issues a GET to a path (e.g. /session) to log them out.
The user clicks a button in a form that issues a POST to a path (e.g. /session) to log them out.
Neither of these solutions is ideal, however:
The link-based GET causes a mutation of server state (it deletes the session). This is in conflict with the intended semantics of GET and can interact poorly with other features of the web platform such as prefetch.[40]
The form-based POST is more idiomatic, but the logout operation is idempotent and should be safely retryable, whereas a POST request is not.
Of the two, the POST option is clearly better, but developers nevertheless often use GET because HTML doesn't provide a natural way to describe ending or deleting a resource.[41] Left with the need to invent their own semantics, developers frequently choose what's simplest (which is a link).[42]
The ideal request for this common piece of functionality would be one that is known to be mutative, known to be idempotent, and accurately describes the action being taken. If HTML were able to issue a DELETE to /session it would these needs in a way that it currently cannot, making implementing this extremely common functionality less error-prone and more natural.

Application Server Permissions
The most popular web frameworks all support the ability to declare handlers for HTTP route and method combos. Access to additional methods dramatically simplifies route declaration and remove the potential for footguns.

In this example, we'll be using ExpressJS (a popular JavaScript server), and re-using the hotel reservation concept from Section 3 to show what a server implementation could look like.[43]

router.post(   '/reservation',                   requireLogin,     createReservation)
router.get(    '/reservation/:reservationId',    requireOwnership, getReservation)
router.post(   '/reservation/:reservationId',    requireOwnership, updateReservation)
Even if you are unfamiliar with ExpressJS, it is relatively easy to understand what is going on here. ExpressJS lets you declare a method, a route, and then a series of functions that handle the request. To make a reservation, the client issues a POST request to /reservation, then runs the requireLogin function, and if that succeeds, runs the createReservation function.[44] Viewing and updating a reservation requires it to be your reservation, checked by the requireOwnership method.

How then, should we implement the ability to delete a reservation? Without access to additional HTML methods in the form, we have two choices. We can double-up on a handler:

// Note the new updateOrDeleteReservation method
router.post(   '/reservation',                   requireLogin,     createReservation)
router.get(    '/reservation/:reservationId',    requireOwnership, getReservation)
router.post(   '/reservation/:reservationId',    requireOwnership, updateOrDeleteReservation)
No longer does the router, and therefore the network layer, have a complete view of the application's functionality, because deletes and updates happen within the same function. If POST /reservations/:reservationId starts throwing internal server errors, it won't be immediately obvious what functionality is impacted.

Also, deletes and updates might have different permissions associated with them! What if you want to implement group reservations, and give everyone in the group permission to edit the reservation, but only the owner permission to delete it? The safest, simplest, and most secure way would be to have separate routes with separate permission functions, but since we're re-using one function for two actions, we don't have access to that. To accomplish that, we have to mess with the URI:

router.post(   '/reservation',                        requireLogin,             createReservation)
router.get(    '/reservation/:reservationId',         requireGroupMembership,   getReservation)
router.post(   '/reservation/:reservationId',         requireGroupMembership,   updateReservation)
router.post(   '/reservation/:reservationId/delete',  requireOwnership,         deleteReservation)
Now we have the ability to declare separate permissions, but we've lost the essential semantic that the URI represents a resource. This get messy fast. What if reservations have sub-resources, like members? It's easy to model that for getting and updating the reservation, because you just add /members to the URI. But now we have two confusing cases—one where the sub-resource after the reservation represents a new thing, and one where it represents an action on the main resource. This does not scale.

The ideal situation is obvious, from the server's standpoint:

router.post(   '/reservation',                        requireLogin,             createReservation)
router.get(    '/reservation/:reservationId',         requireGroupMembership,   getReservation)
router.put(    '/reservation/:reservationId',         requireGroupMembership,   updateReservation)
router.delete( '/reservation/:reservationId',         requireOwnership,         deleteReservation)
Each action has a distinct method, permission, and handler. The client has access to idempotency semantics now, so the client knows that it's safe to retry the PUT and DELETE requests. The network layers can log and track each of the actions at an appropriate level of granularity. And most importantly, the purpose of the server is clear and legible to present and future maintainers.

Alternatives and Additions
Custom Method Attribute
In addition to adding PUT, PATCH, and DELETE support to the method attribute, it makes a lot of sense to add another attribute, custommethod, that overrides the value in method:

<form action="/reservations/123" method="POST" custommethod="PUT">
  <input type="text" name="name">
  <button>Submit</button>
</form>
In this example, browsers that support PUT and custommethod would issue a PUT request to the specified action, while browsers that do not support those features would issue a POST request (servers would have to support both methods, of course). This solves the problem where existing browsers that do not recognize the value in method will fallback to a GET request, by allowing method to serve as a "best supported method" fallback, while custommethod explicitly denotes experimental behavior.[45]

Another major advantage of the custommethod attribute is that it allows for a more robust polyfill mechanism. The existing Triptych polyfill has the crucial caveat that client-side JavaScript cannot modify navigation in the manner necessary to create the robust experience proposed here. The addition of a bridge attribute enables a better, navigation-only polyfill, from the server side:

<form action="/reservations/123" method="POST" custommethod="PUT">
  <input type="hidden" name="_method" value="PUT">
  <input type="text" name="name">
  <button>Submit</button>
</form>
While a bit clunky visually, this form builds on the existing method workarounds to create a smooth upgrade path. Servers that recognize the hidden input hack can handle matching POST and PUT requests with the same handler function. That one handler can return a 303 "See Other" redirect for both cases, which achieves the same thing regardless of whether the browser sent a POST or a PUT request. As browser support picks up and the need for a fallback diminishes, the hidden input and override can be removed in favor of a single method=PUT.

We chose custommethod as the attribute name in anticipating that it will one day be used for proper custom HTTP method support, of the kind anticipated in this working group note. Eventually, it can be used for entirely arbitrary HTTP methods, while method is reserved for officially supported ones. In this manner, the upgrade/fallback mechanism proposed here can be re-used for future additions to HTTP's methods.

Omit PATCH
PUT and DELETE are necessary to include a full CRUD grammar in HTML; PATCH is not.

If you are going to do the work to generalize the <form> method attribute anyway, it doesn't seem like there's huge benefit to omitting PATCH. Nevertheless, the proposal could mostly succeed in its goals without PATCH, since most RESTful design practices focus on PUT and DELETE.

Allow for DELETE request bodies
There's no inherent reason why a DELETE request couldn't send body content, and many popular frameworks, like ExpressJS, do support it. Nor is DELETE content expressly prohibited by the spec, which allows for such requests if the origin server has indicated that it supports them. Since most HTML forms are same-origin, it could make sense to allow the form to indicate that it would be fine with DELETE content.

A usebody attribute could be included to indicate support. If present, the form would send its data as part of the body, for DELETE (or GET) requests; it would be ignored for all other methods.

Update History
Nov 10, 2024
Publish proposed fetch spec changes required to support CORS preflights in navigation.
Sept 4, 2024
Changed overridemethod to custommethod
Added note about handling non-redirection codes identically
Aug 29, 2024
Attended WHATNOT meeting and received feedback on proposal.
Aug 26, 2024
Added "Override Method and Server-Side Polyfill" section
Footnotes
[1] While PUT is capable of creating new resources, POST is preferred when the service selects a proper URI on behalf of the client. This is the simplest RESTful pattern, and has the additional benefit of using a non-idempotent method, so the browser can guard against creating two new things when only one is desired. More benefits to using this pattern will be discussed in the justifications section. ↩

[2] The 303 SEE OTHER status code is used here because it directs the agent to make the subsequent request as GET, regardless of what method the original request used. 302 FOUND does not do this this, but for historical reasons, browsers typically change POST to GET, while leaving PUT, PATCH, and DELETE methods as is. For this reason, we use 303 for everything. ↩

[3] The significance of these changes will be discussed more in Completing REST. ↩

[4] In Bugzilla Issue #10671, Ian Hickson wrote: PUT as a form method makes no sense, you wouldn't want to PUT a form payload. DELETE only makes sense if there is no payload, so it doesn't make much sense with forms either.
While we disagree with this comment for the many of the same reasons that Cameron Jones and Tom Wardrop did originally, there is one limited sense in which Hickson's comment is correct: it doesn't make much sense that you have to wrap a button in a form tag to issue a payload-less DELETE request. We address this limitation in Triptych Proposal #2: Button HTTP Requests. ↩

[5] When browsers receive a 302 response to a POST form, they typically follow that redirect automatically and change the method to GET; there is no need for this behavior to apply to PUT, PATCH, and DELETE. Changing POST to GET in this fashion is a backwards compatibility carveout in the spec, which has not been applied to other methods in browsers' fetch implementations. Using a 303 to perform POST-redirect-GET flow (replacing POST with PUT or DELETE) is already a well-understood pattern for server frameworks that support these methods, so no additional carveouts are needed to integrate with them. For instance, ExpressJS and Rails. ↩

[6] On Sat, 02 Apr 2011, Julian Reschke writes: In the meantime I recalled the main reason why I got nervous about what the FF4 beta implemented; it adopted the broken XHR behavior for following redirects (rewriting the request method to GET), and it also had the URI encoding for one of the methods wrong. ↩

[7] "Content" was previously known as "payload" or "payload body", and is set using the body property of a fetch request. ↩

[8] All three methods support the same Content-Type headers, and they are differentiated from each other based on the intent for the enclosed representation, not the representation itself. Per RFC9110, the difference between POST and PUT is highlighted by the different intent for the enclosed representation, which implies that they support the same set of representations. Per RF5789, which defines PATCH, the difference between the PUT and PATCH requests is reflected in the way the server processes the enclosed entity to modify the resource, which again implies that they are capable of representing resources the same way. ↩

[9] For examples, see REST Support in Server Frameworks ↩

[10] While RFC9110 states that a DELETE request has no generally defined semantics, it also states that a client SHOULD NOT generate content in a DELETE request unless it is made directly to an origin server that has previously indicated, in or out of band, that such a request has a purpose and will be adequately supported. While one could certainly argue that the server returning HTML with <form method=DELETE> constitutes indication of support for content, we defer to the library ecosystem, which generally understands the similar language in the GET and DELETE specs as a tacit discouragement of body content for both. ↩

[11] While many server frameworks are agnostic to the relationship between HTTP methods and the body of the HTTP request, one notable exception is the golang standard library's ParseForm function, which reads POST, PUT, and PATCH requests as urlencoded forms, but ignores the body if the request has any other method. ↩

[12] RFC 5789 Section 2, ↩

[13] RFC 9110 Section 9.2.3 ↩

[14] RFC 9110 Section 9.3.4, Section 9.3.5 ↩

[15] The fetch spec will actually have to be amended slightly to unpeg CORS from forms capabilities, since we advocate for extending form capabilities without adding to the CORS-safelisted methods or CORS-safelisted request headers. Specifically, the part that says: for requests that are more involved than what is possible with HTML's form element, a CORS-preflight request is performed, to ensure request’s current URL supports the CORS protocol. ↩

[16] @annevk on issue #3577 We cannot bypass the same-origin policy and enforcing CORS is theoretically possible, but would require integration of that to some extent with navigation, which is completely new ground. ↩

[17] We refer specifically to its application of CORS to link navigation. ↩

[18] This is another, highly significant, reason not to tunnel PUT and DELETE through POST requests with ad-hoc semantics, one that did not exist when Amundsen et. al were arguing for PUT and DELETE support in WHATWG Bug 10671. ↩

[19] It also opens the door for the possibility of introducing a new method (i.e. CREATE) that serves a similar purpose to POST but is unburdened by the same backwards compatibility concerns. POST could continue to serve as a this action isn't worth standardizing method, and work for legacy applications. ↩

[20] CORS and the SameSite Attribute dramatically reduce the opportunity for attackers to execute cross-site requests. ↩

[21] The MDN Page for CSRF ends with this note: There are many ways to prevent CSRF, such as implementing [sic] RESTful API, adding secure tokens, etc. Unfortunately, it doesn't describe how a RESTful API might mitigate CSRF. What they likely mean by this is that ensuring GET requests do not have side effects mitigates a number of CSRF pathways, but it's also true that HTML does not does not properly support RESTful APIs, nor does it currently have the ability to make any unsafe HTTP requests that are fully protected by CORS. For more on the importance of supporting REST and the ways in which HTML support is inadequate, see Completing REST. ↩

[22] Carson Gross notes in HATEOAS — An Alternative Explanation that the Wikipedia Entry for "Hypertext as the engine of application state", one of REST's fundamental constraints, uses a JSON API as an example, even though JSON is not hypertext. Roy Fielding is less polite: in REST APIs must be hypertext-driven, he complains that a different "REST" API, which also did not user hypertext, has so much coupling on display that it should be given an X rating. ↩

[23] Section 5.1.5: REST enables intermediate processing by constraining messages to be self-descriptive: interaction is stateless between requests, standard methods and media types are used to indicate semantics and exchange information, and responses explicitly indicate cacheability. ↩

[24] Fielding, in 2009: Search my dissertation and you won't find any mention of CRUD or POST. The only mention of PUT is in regard to HTTP's lack of write-back caching. The main reason for my lack of specificity is because the methods defined by HTTP are part of the Web's architecture definition, not the REST architectural style. ↩

[25] Section 7.3.1.2 ↩

[26] "REST APIs must be hypertext-driven", Comment #13 ↩

[27] Fielding's comments on method usage are somewhat contradictory. In It is okay to use POST, he seems broadly committed to the principle that the server gets to define what the methods mean, reminding readers that specific method definitions (aside from the retrieval:resource duality of GET) simply don't matter to the REST architectural style. He also asks: why shouldn't you use POST to perform an update? Hypertext can tell the client which method to use when the action being taken is unsafe.

But in the next paragraph, he says that POST is an issue when it is used in a situation some other method is ideally suited, including complete replacement of a representation (PUT). So it's fine to use POST to update a resource, unless your update is a complete representation of that resource, in which case it's not? Is it fine to use POST method to delete a resource, a task for which DELETE is ideally suited?

The most reasonable way to interpret Fielding's statements here (and the statements referenced in the following footnote) is that REST is primarily concerned with defending the distributed system's ability to write self-describing messages, but deliberately unconcerned with what those messages mean, as long as they do not violate any of the already-established out-of-band agreements enshrined within the protocols themselves. This allows for some necessary compromises to the theoretical purity of self-description—like the user agent being able build security features around the knowledge that GET requests are safe—while still allowing for method extension and graceful fallback. ↩

[28] n.b. Fielding's "REST APIs must be hypertext-driven" blog does include the follow bullet: A REST API should not contain any changes to the communication protocols aside from filling-out or fixing the details of underspecified bits of standard protocols, such as HTTP's PATCH method or Link header field. Workarounds for broken implementations (such as those browsers stupid enough to believe that HTML defines HTTP's method set) should be defined separately, or at least in appendices, with an expectation that the workaround will eventually be obsolete. Exactly what he means by browsers stupid enough to believe that HTML defines HTTP's method set is a little vague, but it clearly demonstrates frustration with HTML's limited method support. ↩

[29] This is neverthless an intriguing idea. If HTML allowed the use of arbitrary HTTP methods, developers could pilot new client networking semantics in a backwards-compatible fashion. This concept was actually included in W3C HTML Form HTTP Extensions, another previous attempt to get these methods into HTTP forms. We choose to omit it here in an effort to reduce to surface area of this change, and make it more likely to be accepted. ↩

[30] Both of these explicitly sidestep the "controversy" about whether PUT and DELETE should be supported by HTML. Fowler notes that in the absence of PUT and DELETE support in HTML, what we essentially have in HTTP is GET and POST standing in for safe and unsafe requests, respectively. ↩

[31] Tutorial: Create a web API with ASP.NET Core; interestingly, this tutorial doesn't even mention REST, although it does link to another page describing RESTful APIs. ↩

[32] The purpose of describing REST in this detail, and the "REST in Practice" subsection in particular, is to make clear that REST is not an ivory tower architecture that developers have failed to follow; it's an attempt to explain the best real-world developer practices and model the ways in which user agents can support them. The lack of proper method support is a real problem that developers continually work around. For evidence of this, see Ecosystem Demand. ↩

[33] To be clear, this is a very reasonable limitation—JavaScript probably shouldn't be able to do that. That's why this will require expanding the navigation spec to include resources for additional methods. ↩

[34] This is the biggest weakness of the Triptych Polyfill, that it cannot make PUT form requests that navigate to an entirely new page, therefore cannot properly implement POST-redirect-GET (with PUT instead of POST). It cannot even intercept 303 redirects and manually navigate to them, because the location header is not available in fetch's manual redirect mode. ↩

[35] Among the many reasons for this are that end-users can use browser controls to manage "hard" navigations—and browsers can optimize around that behavior without any addition effort from users or page authors. ↩

[36] Wikipedia obviously supports enormous traffic, but the type of interactivity is mostly limited to creating and updating hypertext pages, as well as managing a user account, neither of which push the limits of what an HTML form can currently describe. The addition of method=DELETE might be helpful for something like deleting a comment on a user talk page, but by and large, Wikipedia's core functionality does not involve a lot of deleting things, so the compromises involved with representing the deletions it does has are minimal. ↩

[37] For instance, unpoly can automatically convert PUT forms into POST forms with an <input name=_method value=PUT> input. ↩

[38] These points are not new; many of them were made by Mike Amundsen in the closed WHATWG Bug 10671. ↩

[39] You might reasonably wonder why this is bad, when earlier we discussed how interesting opportunities that would be available if methods were entirely arbitrary. The answer is: because telling the user agent what the method is lets it pilot new features and be resilient to ones it doesn't understand. When extensions like these are tried out in the method slot, the user agent can choose to optimize them if they are recognized—like trusting the idempotence of GET or PUT—or fallback to a baseline behavior if they are not. Of course, HTTP already has features that differentiate GET, POST, PUT, and DELETE, so the question of whether browsers might build features around those is not theoretical—they already do. ↩

[40] Not only did prefetch cause issues with a number of existing websites when it was first introduced, it remains a live source of bugs even today. ↩

[41] This pattern is so common it was officially supported and only recently deprecated by Django. ↩

[42] That you cannot delete a resource with HTML is the primary semantic problem here, but there is a second one: it feels strange to wrap an action like "logout" in a form when you're clearly not submitting a form. Writing it as a link feels much more direct. We address this limitation in Triptych Proposal #2: Button HTTP Requests. ↩

[43] We use ExpressJS because it has an especially nice declarative interface for middleware, but the basic concepts can be easily translated to other frameworks like Flask (Python), Spring (Java) and Rails (Ruby). ↩

[44] The indentation serves no purpose other than readability. ↩

[45] If the author intended to send form data as body content, this has the regrettable side-effect of exposing that form data to the URL in the form of query parameters. This could cause information leakage—URLs are visible in plaintext in various context where request content is not. As long as browser support for the new methods remains a live concern, the possibility of information leakage will hinder adoption in sensitive contexts.

Thanks to @jlunman for asking us to address this issue. ↩


Button Actions
Authors
Alexander Petros (contact@alexpetros.com)
Carson Gross (carson@bigsky.software)
Date Created
January 28, 2025
Last Updated
January 28, 2025
Issue Tracker
Pending
Status
Pending
Summary
Goals
Proposed Changes
Sample Usage
Logout Button
Multi-Action Pages
Technical Specification
Enabling Button Actions
Interaction with forms
Existing Workarounds
Wrap The Button in a Form
Using Links Instead of Buttons
Alternatives
Disallow GET requests on buttons
Allow name and value
Footnotes
Summary
Give buttons the action attribute, allowing them to make HTTP requests.

Proposal 2/3 in the Triptych Proposals.

Goals
Make buttons more useful
Encourage semantic use of buttons by giving them interactive capabilities that other elements lack
Expand HTML's ability to describe network requests declaratively
Proposed Changes
New attributes for the button:

action - the URL to request
method - the HTTP method to make the request with
When the action attribute is specified, clicking the button issues an HTTP request to the specified URL. The method attribute can be used to change the HTTP method of the request; it defaults to GET if not specified.

When a button with the action attribute is included inside a form, it does not submit the form. Instead, it makes the request without submitting additional data, exactly the same as if there had been no form at all.

Sample Usage
Logout Button
One of the most common user interactions on the web is logging in or out of a website. A simple POST form, with username and password inputs, can model this interaction.

Logouts, however, do not submit data. There is currently no semantic way to represent a logout button; you have to wrap it in a form. This is one way to do it:

<form action=/logout method=POST><button>Logout</button></form>
With support for button actions, we can instead model this as a lone button creating or deleting a "session" resource.[1]

<button action=/session method=DELETE>Logout</button>
This creates a simplifying symmetry for session management, and allows the logout action to take advantage of DELETE's idempotency.[2]
Multi-Action Pages
Consider a simple job application webform, which uses button actions:

<form action="/apply" method="POST">
  <input type="text" name="name">
  <input type="email" name="email">
  <textarea name="coverletter"></textarea>

  <button>Submit</button>
  <button formaction="/draft">Save Draft</button>
  <button action="/" method="GET">Cancel</button>
</form>
The first part of the form is three inputs that the job seeker must fill out: a name, an email, and a cover letter.

The second part is three actions you can take: you can submit the application, save a draft of it, or give up on applying entirely. Each of these buttons interacts with the <form> element differently!

The Submit button submits the form, sending a POST request to the /apply URL.
The Save Draft button submits the form, but its formaction attribute changes the form's submission URL to /draft.
The Cancel button doesn't interact with the form at all. It just navigates back to the home page.
Semantically, each of these buttons represents a reasonable form operation: a user might choose to submit a form, save it as a draft, or cancel it entirely. Without button actions, you can't describe the "Cancel" action correctly.[3]

Now let's say you save a draft and return to edit it. The web page looks like this:

<form action="/apply" method="POST">
  <input type="text" name="name" value="Alexander Petros">
  <input type="email" name="email" value="contact@example.com">
  <textarea name="coverletter">
    My name is Alex and my passion is enterprise software sales.
  </textarea>

  <button>Submit</button>
  <button formaction="/draft/123" formmethod="PUT">Save Draft</button>
  <button action="/draft/123" method="DELETE">Delete Draft</button>
  <button action="/" method="GET">Cancel</button>
</form>
While the inputs of this form are the same, they have been pre-filled with the current values of the draft job application.[4] We have also changed one button and added a brand new one.
The Submit button still submits the form.
The Save Draft button now sets the method to PUT and the URL to /draft/123, which references the specific draft being modified.
The Delete Draft button uses button actions to issue a DELETE request to /draft/123, with no body.
The Cancel button still navigates to the home page.
Once again, all of these buttons are, from the user's perspective, co-equal form controls. But only two of the buttons rely on the form data; two of them do not. Adding buttons that can perform requests independently not only removes the need to wrap them in forms, it also allows for simpler nesting within forms to achieve a complete set of form controls.

Technical Specification
Button actions are a seamless extension of the existing ways to make HTTP requests from HTML. They mimic the semantics of form submission, but with no data.
Enabling Button Actions
To make a request with a button, the action attribute must be specified with a valid URL. The method attribute defaults to GET if not specified; it can also be set to all supported HTTP form methods.[5]

Buttons can issue requests if they are type=submit, the default button type.[6] This is done to both simplify the interface, and align with author expectations that a button with type=submit (or no type specified) is capable of making requests.[7]

Buttons that have any other type attribute should ignore the method and action attributes.

Interaction with forms
Buttons with the action attribute that are children of a form will not submit any of the form data when clicked.

If the method attribute is specified but no action attribute is, then the method attribute is ignored; the existing formmethod attribute should be used to alter the method of the form.

Existing Workarounds
Wrap The Button in a Form
As seen in Section 3, buttons can currently be made to issue POST requests by wrapping them in a form:

<form action=/logout method=POST><button>Logout</button></form>
This wrapping obscures the intended semantics: that's just a button that makes a request, not a form to fill out. This limitation is not shared by JavaScript, where one can listen for click events on buttons and issue HTTP requests in response; forms play no role in that process. Wrapping buttons in input-less forms is a workaround for missing functionality in HTML.

Wrapping buttons in forms also only works for POST methods. One might be tempted to do the same with a GET request, like so:

<form action=/cancel method=GET><button>Cancel</button></form>
But this results in a request to /cancel?, with an extraneous query parameter, which is incorrect.

This technique also cannot be used within forms, for any method. Consider how you might implement the Multi-Action Pages example with currently-existing native HTML controls:[8]

<form action="/apply" method="POST">
  <input type="text" name="name" value="Alexander Petros">
  <input type="email" name="email" value="contact@example.com">
  <textarea name="coverletter">
    My name is Alex and my passion is enterprise software sales.
  </textarea>

  <button>Submit</button>
  <button formaction="/draft/123" formmethod="PUT">Save Draft</button>
  <button formmethod="DELETE">Delete Draft<button>
  <a href="/">Cancel</a>
</form>
Here the formmethod attribute has been set to DELETE so the browser (assuming DELETE is supported) will issue a DELETE request to /apply. Unfortunately, this request will include all of the values in the form, which is neither expected nor desired.[9]

A second approach is to create a second form for the Delete Draft button. This approach suffers from the HTML specification rule that forms cannot be nested. Therefore we would need to put the new form outside the current form and refer to it using the form attribute:

<form action="/apply" method="POST">
  <input type="text" name="name" value="Alexander Petros">
  <input type="email" name="email" value="contact@example.com">
  <textarea name="coverletter">
    My name is Alex and my passion is enterprise software sales.
  </textarea>

  <button>Submit</button>
  <button formaction="/draft/123" formmethod="PUT">Save Draft</button>
  <button form="delete-form">Delete Draft<button>
  <a href="/">Cancel</a>
</form>

<form id="delete-form" action="/apply" method="DELETE"></form>
This gets the functionality working, but its meaning is much less clear to the HTML reader (both developers and assistive technologies) due to the loss of locality.[10] The "Delete Draft" button has to be modeled as a separate form, even though logically it's not.

Note that in both examples, the Cancel button is now a link, which will have to be styled to look like a button, or else it will look very out of place. This despite the fact that "cancellation" is an action on the current resource, rather than a navigation to another resource (more on the implications of that in the following subsection).[11]

This limitation is endogenous to HTML, not the web platform itself: developers often eschew HTML functionality entirely by describing the UI with buttons and adding the appropriate functionality with scripting. Button actions remove this limitation, allowing HTML to model these form actions both semantically and functionally.

Using Links Instead of Buttons
For buttons that would issue GET requests, it is possible to instead use links and style them like a button. This is very common:

<a href=/logout class=button>Logout</a>
Visually, it is deceptively tricky to style links exactly like styled buttons. And, if you are using unstyled buttons that inherit the system button appearance from the user's OS (often the most accessible UX), then it is impossible.
Buttons and links also have different semantics. Buttons model actions which affect the current document, while hyperlinks model other documents (which the user could choose to open in the current browsing context, or a new one). Even though they both might result in GET requests, they represent different possibilities on the page.

These distinct semantics affect how browsers implement buttons and links. One example is the middle-click: when browsing with a mouse, you can middle-click a link and it will usually open in a new tab, but if you middle-click a form submission button, the form will get submitted in the same window.

Recall the Multi-Action Pages example, where one button submits the form and another cancels it.

<form action="/apply" method="POST">

  <!-- inputs omitted for clarity-->

  <button>Submit</button>
  <button action="/" method="GET">Cancel</button>
</form>
In a multi-page website, both of these actions should be page navigations. The "submit" button performs a page navigation with form submissions. The "close" button should be able to perform a page navigation that doesn't submit a form (since it was cancelled). A button enforces that the close action always happens in this browsing context, while a hyperlink does not.

This proposal does not take a stand on exactly when a button is appropriate versus a hyperlink. It simply acknowledges that there are times when a button is the appropriate semantic, even when the desired action is a page navigation. Those semantic differences are mildly consequential in our existing web browsing paradigms; they may be more or less so in future ones.

Alternatives
Disallow GET requests on buttons
Some might worry that allowing buttons to make GET requests could lead to confusion about when buttons are appropriate instead of hyperlinks. If this were a blocker to adoption, button actions could forgo implementing method=GET.

We are of the opinion that the hyperlink is the single best-understood HTML metaphor, and that it is very unlikely that authors will start defaulting to buttons where hyperlinks would be appropriate.

This also creates a confusing diversion from the form implementation, where method=GET is the default. Disallowing GET would require choosing a different for buttons, thereby creating unnecessary mental overhead in remembering which elements have which defaults for the same attribute.

Allow name and value
It's possible to let lone buttons submit a single datum, using the name and value attributes.[12]
<button
  action=/members
  method=POST
  name=person
  value=Alex
  >Signup
</button>
This is a reasonable thing to add, and would fit well within the existing semantics of the button, which can have values that get submitted along with their parent form.

It is left out of the main proposal, however, in order to curtail scope. Most of the use-cases for this can also be accomplished with URLs and query parameters.

Footnotes
[1] Absent PUT, PATCH, and DELETE support, we can instead do <button action=/logout method=POST>Logout</button>, which is also fine. ↩

[2] One benefit of this simplification is enabling server frameworks that implement file-based routing (like base PHP, SvelteKit, and NextJS) to implement their authentication entirely within one file. A JS codebase, for instance, might have a sessions.js file, which exports two methods: post and delete. That same file can contain internal helper functions that handle authentication, nicely encapsulating the session management logic and re-using many of the same resources. ↩

[3] The button element's existing formmethod and formaction methods, which modify the behavior of their containing form, cannot achieve the same "Cancel" experience: using them here would incorrectly navigate to the home page with the form's contents as a query parameter.

You could achieve the same behavior with a link, however, and just style it like a button. That will be discussed further in the existing workarounds section. ↩

[4] This is the essence of Hypertext As the Engine of Application State (HATEOAS). ↩

[5] At the time of this writing, only GET and POST are supported. With the adoption of Triptych #1, PUT, PATCH, and DELETE would also be supported. In the future, this attribute could include arbitrary custom methods as well. ↩

[6] submit is a mildly regrettable name in this context, as it is not typically used outside the context of a form (one does not really "submit" a link navigation). It is far more important, however, that the button actions work with the default type, which is and always will be submit, than it is to have a better name for that functionality. Besides, it's far from the most confusing default name in HTML. ↩

[7] This document uses the term "author" in the same way that the HTML Design Principles do, to mean the person writing the HTML. ↩

[8] Although still assuming PUT, PATCH, and DELETE support; absent those it's even less clear, because you have to use make both "Save Draft" and "Delete Draft" POSTs, and change the "Delete Draft" URL to something like /draft/123/delete. ↩

[9] Another drawback is that the form implementation of DELETE requests will likely use URL query parameters, like GET requests, rather than form-encoded bodies, like POST requests. This means that the URL may be excessively long, and contain leak data that should not have been shared at the URL level. ↩

[10] For more on the topic of locality, and its importance to HTML specifically, see "Locality of Behaviour." ↩

[11] Styling links as buttons is also a somewhat controversial practice. ↩

[12] htmx's hx-vals attribute is a more expansive take on this concept, where the values are encoded as JSON in the attribute value. ↩