ispy.checkIfPassing = function() {
    if (!ispy.current_event) return;
}

ispy.getSelectionCuts = function() {
    var cuts = {};
    var names = ispy.getSceneObjects();
    var keyMapping = {
        "# Muons": names["TrackerMuons"],
        "# Electrons": names["GsfElectrons"],
        "# Photons": names["Photons"],
        "Charge Sign": "charge",
        "Min Pt": "pt",
        "MET Min Pt": "met_pt",
    }
    ispy.subfoldersReduced["Selection"].forEach(e => {
        cuts[keyMapping[e.property]] = e.getValue();
    });
    return cuts
}

ispy.getParticles = function() {
    let objects = ispy.scenes["3D"].getObjectByName("Physics");
    if (!objects) return;
    let names = ispy.getSceneObjects();
    let part_names = [names["TrackerMuons"], names["GsfElectrons"], names["Photons"]];
    var particles = {};
    // part_names = part_names.filter(name => name);
    part_names.forEach(name => {
        if (!name) return;
        particles[name] = [];
        var lines = objects.getObjectByName(name).children;
        lines.forEach(line => {
            particles[name].push(ispy.getFourVector(name, line.userData));
        });
    });
    particles["MET"] = ispy.current_event.Collections[names['PFMETs']][0][1];
    return particles;
}