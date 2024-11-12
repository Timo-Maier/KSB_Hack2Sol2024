sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'tenderui/test/integration/FirstJourney',
		'tenderui/test/integration/pages/TendersList',
		'tenderui/test/integration/pages/TendersObjectPage',
		'tenderui/test/integration/pages/RequirementsObjectPage'
    ],
    function(JourneyRunner, opaJourney, TendersList, TendersObjectPage, RequirementsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('tenderui') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTendersList: TendersList,
					onTheTendersObjectPage: TendersObjectPage,
					onTheRequirementsObjectPage: RequirementsObjectPage
                }
            },
            opaJourney.run
        );
    }
);