package com.example.springboot;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.wso2.balana.Balana;
import org.wso2.balana.PDP;
import org.wso2.balana.PDPConfig;
import org.wso2.balana.finder.AttributeFinder;
import org.wso2.balana.finder.AttributeFinderModule;
import org.wso2.balana.finder.impl.FileBasedPolicyFinderModule;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(produces = "application/xml")
public class Controller {

	private static Balana balana;

	private static void initBalana(){

		try{
			String policyLocation = (new File("../documents/XACML-policies/")).getCanonicalPath();
			System.out.println("Loading policies from " + policyLocation);
			System.setProperty(FileBasedPolicyFinderModule.POLICY_DIR_PROPERTY, policyLocation);
		} catch (IOException e) {
			System.err.println("Can not locate policy repository");
		}
		balana = Balana.getInstance();
	}

	/**
	 * Returns a new PDP instance with new XACML policies
	 *
	 * @return a  PDP instance
	 */
	private static PDP getPDPNewInstance(){

		PDPConfig pdpConfig = balana.getPdpConfig();

		AttributeFinder attributeFinder = pdpConfig.getAttributeFinder();
		List<AttributeFinderModule> finderModules = attributeFinder.getModules();
		attributeFinder.setModules(finderModules);

		return new PDP(new PDPConfig(attributeFinder, pdpConfig.getPolicyFinder(), null, true));
	}


	/**
	 * Creates DOM representation of the XACML request
	 *
	 * @param response  XACML request as a String object
	 * @return XACML request as a DOM element
	 */
	public static Element getXacmlResponse(String response) {

		ByteArrayInputStream inputStream;
		DocumentBuilderFactory dbf;
		Document doc;

		inputStream = new ByteArrayInputStream(response.getBytes());
		dbf = DocumentBuilderFactory.newInstance();
		dbf.setNamespaceAware(true);

		try {
			doc = dbf.newDocumentBuilder().parse(inputStream);
		} catch (Exception e) {
			System.err.println("DOM of request element can not be created from String");
			return null;
		} finally {
			try {
				inputStream.close();
			} catch (IOException e) {
				System.err.println("Error in closing input stream of XACML response");
			}
		}
		return doc.getDocumentElement();
	}

	@PostMapping("/validate")
	public String index(@RequestBody String request) {

		initBalana();
		PDP pdp = getPDPNewInstance();

		System.out.println("\n======================== XACML Request ====================");
		System.out.println(request);
		System.out.println("===========================================================");

		String response = pdp.evaluate(request);

		System.out.println("\n======================== XACML Response ===================");
		System.out.println(response);
		System.out.println("===========================================================");

		return response;
	}

}
