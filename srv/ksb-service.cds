using { KSBHack2Sol.Tender, KSBHack2Sol.Requirement, KSBHack2Sol.Pump } from '../db/schema';

service KSBService {
    entity Tenders as projection on Tender;
    entity Requirements as projection on Requirement;
    entity Pumps as projection on Pump;
}