using { KSBHack2Sol.Tender, KSBHack2Sol.Requirement, KSBHack2Sol.Pump } from '../db/schema';

service KSBService {
    @odata.draft.enabled
    entity Tenders as projection on Tender
    actions {
        @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {
                    TargetProperties: [
                        '_it/ContainsPump',
                        '_it/HasCompetitor',
                        '_it/status'
                    ],
                    TargetEntities: [
                        '_it/requirements',
                    ]
                },
            )
        action pdfAnalyze();
        action test();
    };
    entity Requirements as projection on Requirement
    actions {
        @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {
                    TargetProperties: [
                        '_it/status'
                    ],
                    TargetEntities: [
                        '_it/pump',
                    ]
                },
            )
        action getProductRecommendations();
    };

    entity Pumps as projection on Pump;
}