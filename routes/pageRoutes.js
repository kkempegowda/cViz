var constants					= require('../scripts/constants');
var logger 						= require(constants.paths.scripts + '/logger');
var util 							= require(constants.paths.scripts + '/util');
var assetBuilder 			= require(constants.paths.scripts + '/assetBuilder');
var auth 							= require('./auth.js');

module.exports = function(app)
{

    // route to keynotes
    app.get('/keynotes', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Keynotes";
        res.render('misc/keynotes.ejs', {});
    });

    // route to clients
    app.get('/clients', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Clients";
        res.render('misc/clients.ejs', {});
    });


    // route to scheduler
    app.get('/scheduler', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Scheduler";
        res.render('misc/scheduler.ejs', {});
    });
    // route to facts
    app.get('/facts', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "facts";
        res.render('misc/facts.ejs', {});

    });

    // route to profile
    app.get('/profile', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "profile";
        res.render('profile.ejs', {});
    });





    // route to feedback
    app.get('/feedback', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "feedback";
        res.render('misc/feedback.ejs', {});
    });
    // route to visits
    app.get('/visits', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "visits";
        res.render('misc/visits.ejs', {});
    });

    // route to admin/users
    app.get('/admin/', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Site Administration";
			  res.locals.appName = "ng-app='cviz-admin'"
				res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general,angular,admin");
				res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,admin");
        res.render('admin/home.ejs', {});
    });

}
