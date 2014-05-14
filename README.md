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
* jQuery event.gevent - Global event handler (https://github.com/mmikowski/jquery.event.ue)
* JQuery event.ue - Unified mouse and touch events (https://github.com/mmikowski/jquery.event.gevent)
* TaffyDB - Javascript DB (http://www.taffydb.com/)
  

Shell module
--
The architecture of this SPA is composed of a central module named shell. This module is responsible for application-wide tasks like management of the URI anchor or cookies, and it dispatches specific tasks to carefully isolated feature modules.

Feature modules
--
In order to improve modularity in the SPA, we use the notion of feature module, which encapsulates an application feature in his own. Each feature module define his own MVC model, and together conform a sort of MVC Fractal model. These feature modules are orchestrated by the Shell and share the same structure.
