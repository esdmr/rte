const url = new URL('/', location.href);
url.hash = '#' + location.pathname;
location.replace(url);
