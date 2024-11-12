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
            Label : 'GrossValue',
            Value : GrossValue,
        },
        {
            $Type : 'UI.DataField',
            Label : 'NetValue',
            Value : NetValue,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Margin',
            Value : Margin,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Currency',
            Value : Currency,
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


