# Contextual Privacy Policies Extension

![cpp_header](https://user-images.githubusercontent.com/20722005/159260547-fef3b267-09ea-4f40-a908-30e2924920e1.png)
**Figure 1: Overview of PrivacyInjector, a contextual privacy policy tool that automatically detects and displays concrete privacy policy information relevant in the context of use. In the above example, a user navigated to the homepage of webex. PrivacyInjector identified those segments in the lengthy policy document (c) that are relevant to cookies and tracking elements. An information icon (a) is displayed on the cookie banner. When a user selects the icon, a sidebar (b) with the extracted information snippets is displayed.**

This is the code belonging to the paper ["Automating Contextual Privacy Policies: Desgin and Evaluation of a Production Tool for Digital Consumer Privacy Awareness"](https://doi.org/10.1145/3491102.3517688). 

**Abstract:** Users avoid engaging with privacy policies because they are lengthy and complex, making it challenging to retrieve relevant information. In response, research proposed contextual privacy policies (CPPs) that embed relevant privacy information directly into their affiliated contexts. To date, CPPs are limited to concept showcases. This work evolves CPPs into a production tool that automatically extracts and displays concise policy information. We first evaluated the technical functionality on the US's 500 most visited websites with 59 participants. Based on our results, we further revised the tool to deploy it in the wild with 11 participants over ten days. We found that our tool is effective at embedding CPP information on websites. Moreover, we found that the tool's usage led to more reflective privacy behavior, making CPPs powerful in helping users understand the consequences of their online activities. We contribute design implications around CPP presentation to inform future systems design.


**Plugin Description:** The browser plugin uses Machine Learning to automatically analyze the privacy policy of the page you are currently visiting and then displays the relevant information directly in their corresponding contexts. This saves you time and helps you connect your actions with the abstract wording of the policies. The plugin saves the annotation of the page and the corresponding url without any personal identifiable information.
This implementation evolves the CPP extension (https://github.com/Maxikilliane/CPP-browser-extension) from its prototypical state to a real-world browser extension by developing a process to automatically identify privacy policies, to automatically segment and annotate them, to automatically identify suitable contexts, and to automatically place them on websites in a way that aligns with the websites’ layout. 

**Requirements**:
1. you need Python3 
2. you need the package-manager conda
3. you need PostgreSQL or another way to store the data of your choice

**Simply install the extension by**:
1. visiting `chrome://extensions/` 
2. enabling the `developer mode`
3. clicking `load unpacked` and choosing the extension's folder

**For the extension to work, you must also run the backend**:
1. install the dependencies by typing `conda install`
2. create a database and the corresponding tables as defined in `backend/models.py`
4. run the backend by executing `app.py`
5. start redis by executing `redis-server`
6. run celery by executing `celery -A app.celery worker --loglevel=info` 

## The plugin has three states indicated by a small badge on the extension's icon:

**Success:** 
This indicates that either the policy of the page has been annotated before and therefore the annotation was loaded from the database or that the new annotation was successful.

![success icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/success.png?raw=true)

**Generating:** 
This means that the annotation of the page's policy is currently in progress. Depending on the length of the policy, this can take up to 4 minutes.

![generating icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/generating.png?raw=true)

**Error:** 
This means that the extension does not work on the page. Most of the time this is because the policy can not be found or the policy is not in English. 

![error icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/error.png?raw=true)

If the annotation was successful, bubbles with the icon of the CPP extension appear on the page. You can click on them to review the policy's information. 



