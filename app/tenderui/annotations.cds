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
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
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
);

