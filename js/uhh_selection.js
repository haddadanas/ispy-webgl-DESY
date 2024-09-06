analysis.getSelectionMessage = function() {
    var pass = analysis.checkIfPassing();
    if (pass == undefined) {
        return "No event file is loaded!";
    }
    var html = "This Event ";
    html += (pass ? "passes" : "does not pass") + " the selection!";
    return html;
}

analysis.getSelectionResults = function() {
    var pass = analysis.checkIfPassing();
    if (pass == undefined) {
        document.getElementById('analysis-results').innerHTML = "No event file is loaded!";
        document.getElementById('mt_hist').src = "";
        return;
    }
    document.getElementById('analysis-results').innerHTML = "Something should be here!";
    document.getElementById('mt_hist').src = "./graphics/console3.png";
    // TODO
    return;
}

analysis.checkIfPassing = function() {
    if (!ispy.current_event) {
        return;
    }

    var pass = true;

    var cuts = analysis.getSelectionCuts();
    var particles = analysis.getParticles();

    for (var name in cuts) {
        if (cuts[name] == -1) continue;
        if (name == "MET") {
            if (particles[name] < cuts[name]) {
                pass = false;
                break;
            }
        } else if (name == "charge") {
            let chargeSum = 0;
            particles["TrackerMuons"].forEach(muon => {
                chargeSum += muon[name];
            });
            particles["GsfElectrons"].forEach(electron => {
                chargeSum += electron[name];
            });
            chargeSum = Math.min(1, Math.abs(chargeSum));
            if (chargeSum != cuts[name]) {
                pass = false;
                break;
            }
        } else if (name == "pt") {
            particles["TrackerMuons"].forEach(muon => {
                if (muon[name] < cuts[name]) {
                    pass = false;
                    return;
                }
            });
            particles["GsfElectrons"].forEach(electron => {
                if (electron[name] < cuts[name]) {
                    pass = false;
                    return;
                }
            });
            if (pass == false) break;
        } else {
            if (particles[name].length != cuts[name]) {
                pass = false;
                break;
            }
        }
    }
    return pass;
}

analysis.getSelectionCuts = function() {
    var cuts = {};
    var keyMapping = {
        "# Muons": "TrackerMuons",
        "# Electrons": "GsfElectrons",
        "# Photons": "Photons",
        "Charge Sign": "charge",
        "Lepton Min Pt": "pt",
        "MET Min Pt": "MET",
    }
    ispy.subfoldersReduced["Selection"].forEach(e => {
        if (! (newKey = keyMapping[e.property])) return;
        cuts[newKey] = e.getValue();
    });
    return cuts
}

analysis.getParticles = function() {
    let objects = ispy.scenes["3D"].getObjectByName("Physics");
    if (!objects) return;
    let names = ispy.getSceneObjects();
    let part_names = ["TrackerMuons", "GsfElectrons", "Photons"];
    var particles = {};
    // part_names = part_names.filter(name => name);
    part_names.forEach(name => {
        collectionName = names[name];
        if (!collectionName) return;
        particles[name] = [];
        var lines = objects.getObjectByName(collectionName).children;
        lines.forEach(line => {
            particles[name].push(ispy.getFourVectorByObjectIndex(collectionName, line.userData));
        });
    });
    particles["MET"] = ispy.current_event.Collections[names['PFMETs']][0][1];
    return particles;
}


analysis.buildFileSummary = function() {

    let event;
    let event_summary = new Map();

    $('#loading').modal('hide');
    $('#building').modal('show');
    try {
	
    // get the event data
    ispy.event_list.forEach((event_path, event_index) => {
        event = JSON.parse(ispy.cleanupData(ispy.ig_data.file(event_path).asText()));
        event_summary.set(event_index.toString(), analysis.getEventsSummary(event));
    }
    )

    // store the event summary as a global variable
    analysis.file_events_summary = event_summary;
    
    // enable the analysis button
    document.getElementById("analysis_btn").disabled = false;

    } catch(err) {
    
    document.getElementById("analysis_btn").disabled = true;

    // create and display an error message
    let error_msg = "Error encountered building the file summary: \n    " + err;
    error_msg += "\nThe event display will work however the full analysis will remain disabled.";
    error_msg += "\nChecking the selection for single events will still work.";
	alert(error_msg);
    }

    $('#building').modal('hide');
    $('#loading').modal('show');

};



analysis.getEventsSummary = function(event_json) {
    let part_names = ["TrackerMuons", "GsfElectrons", "Photons", "PFMETs"];
    let keys = Object.keys(event_json.Collections)
    var map = part_names.map(name => keys.filter(k => k.includes(name)).reduce((x, y) => x > y ? x: y));
    var s = new Map();
    map.forEach((collec) => {

        type = event_json.Types[collec];
        if (collec.includes("MET")) {
            s.set(collec, ispy.getMetInformation(type, event_json.Collections[collec][0]));
            return;
        }
        let tmp = new Array();
        event_json.Collections[collec].forEach((part) => {
            tmp.push(ispy.getFourVector(collec, type, part));
        });
        s.set(collec, tmp);
    })
    return s;
}