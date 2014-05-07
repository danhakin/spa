SPA (Single Page Application)
===
This repository contains files to build a vanilla JS based single page application (SPA).

The main objective is to learn how to create SPAs using pure Javascript and from there decide wheater to use a framework or not depending on the problem-situation to solve.

Dependencies
--
Although this project uses mainly pure javascript, some dependencies are needed to ease the developement.

These dependencies are:

* jQuery (http://jquery.com/)
* jQuery uriAnchor plugin (https://github.com/mmikowski/urianchor) 
  
Since SPA are supossed to run in the client all the time, no more pages refresh at each new page, some common user interactions such as the back button are impacted, so we need to guarantee that these behaviors continue to work as the user expects. In this case, jQuery uriAnchor is used to control browser urls and history to take care of these interactions. 

Shell modules
--
The architecture of this SPA is composed of modules named shells, each shell encapsulates a feature and serves as a feature container. This allows to decouple application features and provides modularity.
