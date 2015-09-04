package com.steppschuh.posterizer;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@SuppressWarnings("serial")
public class PosterizerServlet extends HttpServlet {
	
	private static final Logger log = Logger.getLogger(PosterizerServlet.class.getName());
	
	/*
	 * Handles all requests for the Posterizer website and redirects to the matching JSP.
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		String forwardUrl;
		String requestUrl = req.getRequestURL().toString();
        String uri = req.getRequestURI();
        String rootUrl = requestUrl.substring( 0, requestUrl.indexOf(uri));
        
        // detect language of request origin
        String languageCode = RequestFilter.getRequestLanguageCode(req);
        forwardUrl = "/posterizer/" + languageCode + "/";
        
        // forward requests to available JSPs
		if (requestUrl.contains("/rasterbator/")) {
			// landing page
			forwardUrl += "rasterbatorservlet/";
		} else {
			// landing page
			//forwardUrl += "homeservlet/";
			//forwardUrl += "rasterbatorservlet/";
			
			log.info("Redirecting request to rasterbator");
			forwardUrl = rootUrl + "/rasterbator/";
			resp.sendRedirect(forwardUrl);
			return;
			
		}
		
		// get dispatcher for the generated URL
        RequestDispatcher rd = getServletContext().getRequestDispatcher(forwardUrl);
        
        // set JSP attributes
        req.setAttribute("rootUrl", rootUrl);
        req.setAttribute("requestUrl", requestUrl.replace("/posterizer", ""));
        req.setAttribute("staticUrl", rootUrl + "/static/");
        
        try {
			rd.forward(req, resp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
