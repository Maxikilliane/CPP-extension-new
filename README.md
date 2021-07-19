# Contextual Privacy Policies Extension

This browser plugin uses Machine Learning to automatically analyze the privacy policy of the page you are currently visiting and then displays the relevant information directly in their corresponding contexts. This saves you time and helps you connect your actions with the abstract wording of the policies. The plugin saves the annotation of the page and the corresponding url without any personal identifiable information.
This implementation evolves the CPP extension (https://github.com/Maxikilliane/CPP-browser-extension) from its prototypical state to a real-world browser extension by developing a process to automatically identify privacy policies, to automatically segment and annotate them, to automatically identify suitable contexts, and to automatically place them on websites in a way that aligns with the websites’ layout. 

**Requirements**:
1. you need Python3 
2. you need the package-manager conda

**Simply install the extension by**:
1. visiting `chrome://extensions/` 
2. enabling the `developer mode`
3. clicking `load unpacked` and choosing the extension's folder

**For the extension to work, you must also run the backend**:
1. install the dependencies by typing `conda install`
2. run the backend by executing `app.py`
3. run celery by executing `celery -A app.celery worker --loglevel=info` 

## The plugin has three states indicated by a small badge on the extension's icon:

### Success: 
This indicates that either the policy of the page has been annotated before and therefore the annotation was loaded from the database or that the new annotation was successful.

![success icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/success.png?raw=true)

### Generating: 
This means that the annotation of the page's policy is currently in progress. Depending on the length of the policy, this can take up to 4 minutes.

![generating icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/generating.png?raw=true)

### Error: 
This means that the extension does not work on the page. Most of the time this is because the policy can not be found or the policy is not in English. 

![error icon](https://github.com/Maxikilliane/masters-thesis/blob/master/img/error.png?raw=true)

If the annotation was successful, bubbles with the icon of the CPP extension appear on the page. You can click on them to review the policy's information. If the bubble is placed somewhere at the end of the page and you can't read the text, you can drag the bubble somewhere else to make it easier to read the information. 



