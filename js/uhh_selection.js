ispy.checkIfPassing = function() {
    if (!ispy.current_event) return;
}

ispy.getSelectionCuts = function() {
    var cuts = {};
    var names = ispy.getSceneObjects();
    var keyMapping = {
        "# Muons": names["TrackerMuons"],
        "# Electrons": names["GsfElectrons"],
        "Charge Sign": "charge",
        "Min Pt": "pt",
    }
    ispy.subfoldersReduced["Selection"].forEach(e => {
        cuts[keyMapping[e.property]] = e.getValue();
    });
    return cuts
}

ispy.getLepton = function() {
    objects = ispy.scenes["3D"].getObjectByName("Physics");
    if (!objects) return;
    let names = ispy.getSceneObjects();
    let lep_names = [names["TrackerMuons"], names["GsfElectrons"]];
    var leptons = {};
    // lep_names = lep_names.filter(name => name);
    lep_names.forEach(name => {
        if (!name) return;
        leptons[name] = [];
        var lines = objects.getObjectByName(name).children;
        lines.forEach(line => {
            leptons[name].push(ispy.getFourVector(name, line));
        });
    });
    leptons["MET"] = ispy.current_event.Collections[names['PFMETs']][0][1];
    return leptons;
}