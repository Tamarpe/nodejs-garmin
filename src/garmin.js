const request = require('request');
const express = require('express');
const app = express()

app.set('view engine', 'ejs')

var activities = function(res, parameters) {
    var options = {
        url:  'https://connect.garmin.com/proxy/activitylist-service/activities/' + parameters.email + '?start=1&limit=99',
        headers: {
            'User-Agent': 'request'
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            var result = [];

            info.activityList.forEach(function(activity) {
                var date = new Date(activity.beginTimestamp);
                var month_distance = 0;
                var date = (date.getMonth() + 1) + '/' + date.getFullYear();

                if ( typeof( result[date] ) == "undefined") {
                    result[date] = new Object();
                    result[date].distance = 0;
                    result[date].calories = 0;
                    result[date].avgspeed = 0;
                    result[date].steps = 0;
                    result[date].numberofruns = 0;
                    result[date].duration = 0;
                }

                result[date].numberofruns++;
                result[date].avgspeed = ((activity.duration / 60) / (activity.distance/1000));
                result[date].calories += Number(activity.calories);
                result[date].duration += Number(activity.duration);
                result[date].steps += Number(activity.steps);
                result[date].distance += Number(activity.distance / 1000);
            });


            var entries = [];
            for (var key in result) {
                var entry = new Object();
                entry.date = key;
                entry.distance = Number(result[key].distance).toFixed(2);
                entry.numberofruns = result[key].numberofruns;
                var reminder = result[key].avgspeed - Math.floor(result[key].avgspeed);
                entry.avgspeed = Math.floor(result[key].avgspeed) + ':' + Math.floor(reminder * 60);
                entry.calories = result[key].calories;
                entry.steps = result[key].steps;
                entry.duration = timeConvert(result[key].duration / 60);
                entries.push(entry);
            }

            res.render('content', {
                data: entries,
            })
        }
    })
}

function timeConvert(n) {
    var num = n;
    if (num > 60) {
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + " hour(s) and " + rminutes + " minute(s).";
    }
    else {
        return Math.round(num) + " minute(s).";
    }
}

module.exports = {
    activities : activities,
}