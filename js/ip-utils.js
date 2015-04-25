var ipUtils = function() {
    var padIPs = function (ipArray) {
        for (var i = 0; i < ipArray.length; i++) {
            if (ipArray[i].length == 2) {
                ipArray[i] = '0' + ipArray[i];
            } 
            else if (ipArray[i].length == 1) {
                ipArray[i] = '00' + ipArray[i];
            }
        }
        return ipArray;
    }

    var getProbabilities = function(ipString) {
        var probabilities = [];
        var totalProb = 0;
        for (var i = 0; i < ipString.length; i++) {
            probabilities[i] = parseInt(ipString[i]);
            totalProb = totalProb + probabilities[i];
        }

        for (var i = 0; i < probabilities.length; i++) {
            probabilities[i] = probabilities[i] / totalProb;
        }

        return probabilities;
    }

    var choose = function(probabilities, array) {
        var res = Math.random();
        if (res < probabilities[0]) {
            index = array[0]
        } else if (res >= probabilities[0] && res < probabilities[1]) {
            index = array[1]
        } else {
            index = array[2]
        }
        return index;
    }

    return {
		    pad: padIPs,
		    getProb: getProbabilities,
            choose: choose,
		};
    }();
