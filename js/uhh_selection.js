analysis.getCurrentSelectionMessage = function() {
    var pass = checkIfEventPassing();
    if (pass == undefined) {
        return ["No event file is loaded!", "warning"];
    }
    var html = "This Event ";
    html += (pass ? "passes" : "does not pass") + " the selection!";
    symbol = pass ? "success" : "error";
    return [html, symbol];
}

analysis.getSelectionResults = function() {
    if (analysis.file_events_summary == undefined) {
        document.getElementById('event-statistics').innerHTML = "No event file is loaded!";
        return;
    }
    document.getElementById('event-statistics').innerHTML = "Something should be here!";
    Plotly.newPlot("mt-hist", [{ y: [1, 2, 3] }])
    Plotly.newPlot("m-hist", [{ y: [1, 2, 3] }])
    // TODO
    return;
}

analysis.getSelectionCuts = function() {
    var cuts = {};
    ispy.subfoldersReduced["Selection"].forEach(e => {
        if (typeof(e.getValue()) == "function") return;
        cuts[e.property] = e.getValue();
    });
    return cuts
}


function getMassesArray() {
    var masses = [];
    var massesT = [];
    particles = analysis.getPassingEvents().map(i => {
        return getSelectionParticles(i);
    });
    for (let value of particles) {
        masses.push(getInvariantMass(value));
        massesT.push(getTransverseMass(value));
    }
    return masses;
}


function getSelectionParticles(event_index) {
    var results = new Map();
    let summary = analysis.file_events_summary.get(String(event_index));
    selection = analysis.getSelectionCuts();
    selection = Object.keys(selection).filter(sel => {
        if (["charge", "pt", "PFMETs"].includes(sel)) return false;
        if (selection[sel] < 0) return false;
        return true;
    });
    selection.forEach(key => {
        if (summary.has(key)) {
            results.set(key, summary.get(key));
        }
    });
    return results;
}

function checkIfEventPassing(event_index=-1) {
    if (!ispy.current_event) {
        return;
    }
    if (event_index == -1) {
        event_index = ispy.event_index;
    }

    var pass = true;
    var cuts = analysis.getSelectionCuts();
    var particles = analysis.file_events_summary.get(String(event_index));

    for (let [name, part] of particles) {
        if (name == "PFMETs") {
            pass &&= checkMET(part, cuts[name]);
            break;
        }
        if (cuts[name] == -1) continue;
        if (name == "TrackerMuons" || name == "GsfElectrons") {
            pass &&= checkCharge(part, cuts["charge"]);
            if (!pass) break;
            part = getPtPassingLeptons(part, cuts["pt"]);
        }
        if (part.length != cuts[name]) {
            pass &&= false;
            break;
        }
    };
    return pass;
}

// Helper functions to check the selection
function checkMET(met, cut) {
    return met["pt"] >= cut;
}

function checkCharge(leptons, cut) {
    if (cut == -1) return true;
    let chargeSum = 0;
    leptons.forEach(lepton => {
        chargeSum += lepton["charge"];
    });
    chargeSum = Math.min(1, Math.abs(chargeSum));
    return chargeSum == cut;
}

function getPtPassingLeptons(leptons, cut) {
    return leptons.filter(lepton => lepton["pt"] >= cut)
}

// Get the passing events in the current file
analysis.getPassingEvents = function() {
    if (!ispy.current_event) {
        return;
    }
    var passing_events = [];
    for (let index of analysis.file_events_summary.keys()) {
        if (checkIfEventPassing(index)) {
            passing_events.push(index);
        }
    }

    return passing_events;
}

//
// Get the needed information of all events in the current file
//
analysis.buildFileSummary = function() {

    let event;
    let event_summary = new Map();

    $('#loading').modal('hide');
    $('#building').modal('show');
    try {
	
    // get the event data
    ispy.event_list.forEach((event_path, event_index) => {
        event = JSON.parse(ispy.cleanupData(ispy.ig_data.file(event_path).asText()));
        event_summary.set(event_index.toString(), getEventsSummary(event));
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

function getEventsSummary(event_json) {
    let part_names = ["TrackerMuons", "GsfElectrons", "Photons", "PFMETs"];
    let keys = Object.keys(event_json.Collections)
    var map = part_names.map(name => keys.filter(k => k.includes(name)).reduce((x, y) => x > y ? x: y));
    var summary = new Map();
    map.forEach((collec) => {

        let type = event_json.Types[collec];
        let key = collec.replace(/_V\d/g, '');
        if (collec.includes("MET")) {
            summary.set(key, ispy.getMetInformation(type, event_json.Collections[collec][0]));
            return;
        }
        let tmp = new Array();
        event_json.Collections[collec].forEach((part) => {
            tmp.push(ispy.getFourVector(collec, type, part));
        });
        summary.set(key, tmp);
    })
    return summary;
}

//
// Helper functions for the selection
//

function sumFourVectors(particles) {
    if (particles.length < 1) {
        return -1;
    }
    let sumPx, sumPy, sumPz, sumE;
    sumPx = sumPy = sumPz = sumE = 0;

    particles.forEach((group, key) => {
        group.forEach((val) => {
            sumPx += val.px;
            sumPy += val.py;
            sumPz += val.pz;
            sumE += val.E;
        });
    });

    return {E: sumE, px: sumPx, py: sumPy, pz: sumPz};
}


// Calculate the invariant mass of a list of particles
function getInvariantMass(particles) { // TODO

    let sumVector = sumFourVectors(particles);
    let sumPx, sumPy, sumPz, sumE;
    sumPx = sumVector.px;
    sumPy = sumVector.py;
    sumPz = sumVector.pz;
    sumE = sumVector.E;

    m = sumE*sumE;
    m -= (sumPx*sumPx + sumPy*sumPy + sumPz*sumPz);
    m = Math.sqrt(m);
    
    return m;
}

// Calculate the transverse mass of a list of particles
function getTransverseMass(particles) { // TODO

    let m = 0;
    let sumVector = sumFourVectors(particles);
    let m1 = getInvariantMass(sumVector);

    let met = analysis.file_events_summary.get(String(ispy.event_index)).get("PFMETs");
    let metE = met.px * met.px + met.py * met.py;

    m = m1*m1;
    m += 2*(metE*sumVector.E - sumVector.px*met.px - sumVector.py*met.py);
    m = Math.sqrt(m);

    return m;
}

function createHistogram(array, start, end, bins) {
    // Histogram the array to the range `start` to `end` with `bins` bins
    var hist = new Array(bins).fill(0);
    var binWidth = (end - start) / bins;
    array.forEach((val) => {
        let bin = Math.floor(val/binWidth);
        hist[bin]++;
    });
    return hist;    
}