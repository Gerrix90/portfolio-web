"use strict";var e=1553621796269,r={offline:"offline-v"+e,regular:"regular-v"+e},c="/offline",a=["/"];function i(e){var t=new Request(e,{cache:"reload"});if("cache"in t)return t;var n=new URL(e,self.location.href);return n.search+=(n.search?"&":"")+"cachebust="+Date.now(),new Request(n)}self.addEventListener("install",function(e){var t=fetch(i(c)).then(function(t){return caches.open(r.offline).then(function(e){return e.put(c,t)})}),n=caches.open(r.regular).then(function(e){return e.addAll(a)});e.waitUntil(Promise.all([t,n]))}),self.addEventListener("activate",function(e){var t=Object.keys(r).map(function(e){return r[e]});e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){if(-1===t.indexOf(e))return console.log("Deleting out of date cache:",e),caches.delete(e)}))}))}),self.addEventListener("fetch",function(e){("navigate"===e.request.mode||"GET"===e.request.method&&e.request.headers.get("accept").includes("text/html"))&&(console.log("Handling fetch event for",e.request.url),e.respondWith(fetch(e.request).catch(function(e){return console.log("Fetch failed; returning offline page instead.",e),caches.match(c)})))});