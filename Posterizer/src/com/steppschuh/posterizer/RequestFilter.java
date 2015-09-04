package com.steppschuh.posterizer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

public class RequestFilter implements Filter {

    private FilterConfig filterConfig;
    private static final Logger log = Logger.getLogger(RequestFilter.class.getName());

    /*
     *  Every app engine request will go through this method before it gets forwarded
     * 	to its real destination. We can use it to filter requests.
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
        throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        String uri = req.getRequestURI();
        String path = uri.substring(req.getContextPath().length());
        
        if (path.startsWith("/static") || path.startsWith("/_ah") || path.startsWith("/posterizer")) {
        	// preserve special routes
        	//log.info("Processing a request for " + path);
        	filterChain.doFilter(request, response);
        } else {
        	// forward request to matching servlet
        	//log.info("Forwarding a request for " + path);
        	
        	RequestDispatcher rd = request.getRequestDispatcher("/posterizer" + path);
        	rd.forward(request, response);        	
        }
    }
    
    // method that can be used to forward a request to a given path
    public static void forwardRequest(ServletContext context, HttpServletRequest req, HttpServletResponse resp, String requestPath) {
		RequestDispatcher rd = context.getRequestDispatcher(requestPath);
    	HttpServletRequest wrapped = new HttpServletRequestWrapper(req) {
    		public String getServletPath() { return ""; }
    	};
    	try {
			rd.forward(wrapped, resp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
    
    // creates a map that contains all available header fields
    public static Map<String, String> getHeaderInfo(HttpServletRequest req) {		
		Map<String, String> map = new HashMap<String, String>();	 
		Enumeration headerNames = req.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String key = (String) headerNames.nextElement();
			String value = req.getHeader(key);
			map.put(key, value);
		}
		map.put("RemoteHost", req.getRemoteHost());
		return map;
    }
    
    // reads a cookie from a given requests
    public static String getCookieValue(HttpServletRequest req, String name) {
    	String value = null;
        Cookie cookie;
        Cookie[] allCookies = req.getCookies();
        if (allCookies != null) {
        	for (int i = 0; i < allCookies.length; i++) {
    		    cookie = allCookies[i];
    		    if (cookie.getName().equals(name)) {
    		        value = cookie.getValue();
    		    }
    		}
        }
		return value;
    }
    
    // creates a url containing all request parameters
    public static String getFullUrlFromRequest(HttpServletRequest req) {
    	StringBuilder builder = new StringBuilder();			
		builder.append(req.getRequestURL().toString() + "?");
		
		Iterator entries = req.getParameterMap().entrySet().iterator();
		while (entries.hasNext()) {
		  Entry thisEntry = (Entry) entries.next();
		  String key = (String) thisEntry.getKey();
		  String value = ((String[]) thisEntry.getValue())[0];
		  builder.append(key + "=" + value + "&");
		}
		
		String url = builder.toString();
		url = url.substring(0, url.length() - 1);
		return url;
    }
    
    // gets the (lowercase) country code if present
    public static String getRequestCountryCode(HttpServletRequest req) {
    	String countryCode = req.getHeader("X-AppEngine-Country");
    	if (countryCode != null) {
    		countryCode = countryCode.toLowerCase();
    	} else {
    		countryCode = "us"; // serve English as default
    	}
    	return countryCode;
    }
    
    // tries to detect the language of the request origin
    public static String getRequestLanguageCode(HttpServletRequest req) {
    	// check if request url already contains a known locale
    	String requestUrl = req.getRequestURL().toString();
    	if (requestUrl.contains("/de/")) {
    		return "de";
    	} else if (requestUrl.contains("/en/")) {
    		return "en";
    	}
    	
    	// if no locale is specified, use country code
    	String countryCode = getRequestCountryCode(req);    	
    	
    	// German speaking
    	if (countryCode.equals("de") || countryCode.equals("au") || countryCode.equals("ch") || countryCode.equals("lu")) {
    		return "de";
    	}
    	
    	// for everyone else English will do
    	return "en";
    }
    
    public FilterConfig getFilterConfig() {
        return filterConfig;
    }

    public void init(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
    }

    public void destroy() {}
    
}