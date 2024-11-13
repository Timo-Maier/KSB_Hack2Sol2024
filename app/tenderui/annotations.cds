using KSBService as service from '../../srv/ksb-service';
annotate service.Tenders with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : Description,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Tender Description',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Tender Content',
            ID : 'TenderContent',
            Target : '@UI.FieldGroup#TenderContent',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : Description,
        },
        {
            $Type : 'UI.DataField',
            Value : LastAnalyzedAt,
            Label : 'LastAnalyzedAt',
        },
    ],
    UI.FieldGroup #TenderContent : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : TenderContent,
                Label : 'Tender Content',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'KSBService.Analyze',
                Label : 'Analyze',
            },
        ],
    },
);

annotate service.Tenders with {
    TenderContent @UI.MultiLineText;
};


