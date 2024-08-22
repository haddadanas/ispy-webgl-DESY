ispy.checkIfPassing = function() {
    if (!ispy.current_event) {
        document.getElementById('analysis-results').innerHTML = "No event file is loaded!";
        return;
    }
    var html = "This Event ";
    var pass = true;

    var cuts = ispy.getSelectionCuts();
    var particles = ispy.getParticles();

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
    html += (pass ? "passes" : "does not pass") + " the selection!"
    document.getElementById('analysis-results').innerHTML = html;

    return html;
}

ispy.getSelectionCuts = function() {
    var cuts = {};
    var names = ispy.getSceneObjects();
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

ispy.getParticles = function() {
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
            particles[name].push(ispy.getFourVector(collectionName, line.userData));
        });
    });
    particles["MET"] = ispy.current_event.Collections[names['PFMETs']][0][1];
    return particles;
}