using { KSBHack2Sol.Tender, KSBHack2Sol.Requirement, KSBHack2Sol.Pump } from '../db/schema';

service KSBService {
    @odata.draft.enabled
    entity Tenders as projection on Tender
    actions {
        action Analyze();
    };
    entity Requirements as projection on Requirement;
    entity Pumps as projection on Pump;
}