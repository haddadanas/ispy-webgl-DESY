<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

# iSpy WebGL (Masterclasses @ DESY)

Dieses Repository enthält eine modifizierte Version des iSpy WebGL Event Displays, welches für die Masterclasses am DESY angepasst wurde. Die ursprüngliche Version des iSpy WebGL Event Displays wurde von der CMS Kollaboration (Mitwirkende: [F. Ali](https://github.com/9inpachi), [L. Barnard](https://github.com/lukebarnard), [M. Hategan](https://github.com/hategan), [S. Lee](https://github.com/SeungJunLee0), [C. Logrén](https://github.com/carpppa), [T. McCauley](https://github.com/tpmccauley), [P. Nguyen](https://github.com/phongn), [M. Saunby](https://github.com/msaunby)) entwickelt und ist unter folgende Links verfügbar:

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.8043417.svg)](https://doi.org/10.5281/zenodo.8043417)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/cms-outreach/ispy-webgl)

Production Version: [https://cern.ch/ispy-webgl](https://cern.ch/ispy-webgl)

Publication: [T McCauley 2017 J. Phys.: Conf. Ser. 898 072030](https://doi.org/10.1088/1742-6596/898/7/072030)

## Was ist iSpy WebGL?

iSpy WebGL ist ein browserbasiertes Event Display für das CMS Experiment am LHC. Es ermöglicht die Visualisierung von Ereignisdaten, die von den [iSpy Analyzers](https://github.com/cms-outreach/ispy-analyzers)

<img src="./graphics/ispy-webgl-screenshot-1.0.0.png"></img>

## Erste Schritte

### Öffnen von Files

Über das Menü "Open File" <i class="fa fa-folder-open" style="border: 1px solid black; padding: 6px; display: inline-block;"></i> können Events geöffnet werden. Es gibt zwei Möglichkeiten, Events zu öffnen:

1. **Open local file(s)**: Wählen Sie eine Datei aus Ihrem lokalen Dateisystem aus. Die Datei muss im [.ig](https://github.com/cms-outreach/ispy-analyzers) Format vorliegen.

2. **Open file(s) from the Web**: Wählen Sie aus bereitgestellten Beispielen für verschiedene Prozesse aus.

### Navigation zwischen Events

Nachdem ein file geöffnet wurde, können Sie durch die Events dieses files navigieren, indem Sie die Pfeiltasten Ihres Tastatures <i class="fa fa-arrow-left" style="border: 1px solid black; padding: 6px; display: inline-block;"></i> <i class="fa fa-arrow-right" style="border: 1px solid black; padding: 6px; display: inline-block;"></i> oder die Knöpfe <i class="fa fa-step-backward" style="border: 1px solid black; padding: 6px; display: inline-block;"></i> <i class="fa fa-step-forward" style="border: 1px solid black; padding: 6px; display: inline-block;"></i> aus der oberen Leiste verwenden.

### Ansichten wechseln

Ein Event kann in verschiedenen Ansichten dargestellt werden. Die Ansichten können über die Knöpfe <span style="border: 1px solid black; padding: 3px; display: inline-block;">3D</span>, <span style="border: 1px solid black; padding: 3px; display: inline-block;">r&phi;</span> oder <span style="border: 1px solid black; padding: 3px; display: inline-block;">&rho;z</span> aus der oberen Leiste gewechselt werden. Um auf die Anfangsansicht zurückzukehren, klicken Sie auf den Knopf <i class="fa fa-home" style="border: 1px solid black; padding: 6px; display: inline-block;"></i>.

In der 3D Ansicht lässt sich das Event auch entlang einer Achse anzeigen. Dazu können Sie die Knöpfe <img src="./graphics/yx_small.png" style="background-color: grey;"/>, <img src="./graphics/xz_small.png" style="background-color: grey;"/>  und <img src="./graphics/yz_small.png" style="background-color: grey;"/> verwenden. Dies kann bei der Bestimmun der Teilchenladung und die Beobachtung der Spurkrümmung hilfreich sein.

### Detektor Elemente ein- und ausblenden


## Papers und talks

["WebGL and three.js in CMS"](https://tpmccauley.github.io/cms-webgl-cwp/#/) at the HEP Software Foundation Visualization Workshop, March 2017.

["iSpy WebGL: a browser-based event display for CMS using WebGL"](https://indico.cern.ch/event/570249/contributions/2450053/subcontributions/218722/attachments/1401904/2139981/mccauley-ispywebgl-hsf.pdf) at HEP Software Foundation Visualization Workshop, Jan 2017.

"A browser-based event display for the CMS Experiment at the LHC using WebGL", at CHEP 2016.
[paper](https://doi.org/10.1088/1742-6596/898/7/072030), [slides](https://indico.cern.ch/event/505613/contributions/2228350/attachments/1346680/2045130/Oral-v4-449.pdf), [highlight summary slide](https://indico.cern.ch/event/505613/contributions/2228350/attachments/1346680/2030787/Highlights-v0-449.pdf)