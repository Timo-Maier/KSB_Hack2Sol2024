using KSBService as service from '../../srv/ksb-service';
annotate service.Tenders with @(
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'KSBService.pdfAnalyze',
            Label : 'PDF Analyze',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'IsActiveEntity'}, true]}, true, false ] }}
        },
    ],

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
            Label : 'Is Pump requested',
            ID : 'IsPumprequested',
            Target : '@UI.FieldGroup#IsPumprequested',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'status'}, 1]}, true, false ] }}
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Requirements',
            ID : 'Requirements',
            Target : 'requirements/@UI.LineItem#Requirements',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'status'}, 1]}, true, false ] }}
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
    UI.FieldGroup #IsPumprequested : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : HasCompetitor,
                Label : 'HasCompetitor',
            },
            {
                $Type : 'UI.DataField',
                Value : ContainsPump,
                Label : 'ContainsPump',
            },
        ],
    },
);

annotate service.Tenders with {
    TenderContent @UI.MultiLineText;
};


annotate service.Requirements with @(
    UI.LineItem #Requirements : [
        {
            $Type : 'UI.DataField',
            Value : Flow,
            Label : 'Flow',
        },
        {
            $Type : 'UI.DataField',
            Value : Head,
            Label : 'Head',
        },
        {
            $Type : 'UI.DataField',
            Value : RatedVoltage,
            Label : 'RatedVoltage',
        },
        {
            $Type : 'UI.DataField',
            Value : SupplyFrequency,
            Label : 'SupplyFrequency',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Gerneral Info',
            ID : 'GerneralInfo',
            Target : '@UI.FieldGroup#GerneralInfo',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Pump',
            ID : 'Pump',
            Target : '@UI.FieldGroup#Pump2',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'status'}, 1]}, true, false ] }}
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Pump Costs',
            ID : 'PumpCosts',
            Target : '@UI.FieldGroup#PumpCosts',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'status'}, 1]}, true, false ] }}
        },
    ],
    UI.FieldGroup #GerneralInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Flow,
                Label : 'Flow',
            },
            {
                $Type : 'UI.DataField',
                Value : Head,
                Label : 'Head',
            },
            {
                $Type : 'UI.DataField',
                Value : RatedVoltage,
                Label : 'RatedVoltage',
            },
            {
                $Type : 'UI.DataField',
                Value : SupplyFrequency,
                Label : 'SupplyFrequency',
            },
        ],
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'KSBService.getProductRecommendations',
            Label : 'Product Recommendations',
            ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Ne: [{$Path: 'IsActiveEntity'}, true]}, true, false ] }}
        },
    ],
    UI.FieldGroup #Pump : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.FieldGroup #Pump1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.FieldGroup #Pump2 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : pump.ImpellerDesign,
                Label : 'ImpellerDesign',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.ImpellerTrim,
                Label : 'ImpellerTrim',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.InletWidth,
                Label : 'InletWidth',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.InstallationType,
                Label : 'InstallationType',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.LeadTime,
                Label : 'LeadTime',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.Materials,
                Label : 'Materials',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.MaxInletPressure,
                Label : 'MaxInletPressure',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.MaxOutletPressure,
                Label : 'MaxOutletPressure',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.MotorEfficiency,
                Label : 'MotorEfficiency',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.MotorPerformance,
                Label : 'MotorPerformance',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.MotorPoles,
                Label : 'MotorPoles',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.OutletWidth,
                Label : 'OutletWidth',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.PumpFamily,
                Label : 'PumpFamily',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.ShaftAxisPosition,
                Label : 'ShaftAxisPosition',
            },
        ],
    },
    UI.FieldGroup #PumpCosts : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : pump.COGS,
                Label : 'COGS',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.GrossPrice,
                Label : 'GrossPrice',
            },
            {
                $Type : 'UI.DataField',
                Value : pump.NetPrice,
                Label : 'NetPrice',
            },
        ],
    },
);

