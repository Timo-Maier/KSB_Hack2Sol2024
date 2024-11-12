using { cuid } from '@sap/cds/common';
namespace KSBHack2Sol;

entity Tender : cuid {
  Description           : String;
  TenderContents : String;
  GrossValue            : Decimal(15, 2);
  NetValue              : Decimal(15, 2);
  Margin                : Decimal(5, 2);
  Currency              : String(3);
  ContainsPump : Boolean;
  HasCompetitor : Boolean;
  requirements : Composition of many Requirement on requirements.tender = $self;
}

entity Requirement : cuid {
  tender : Association to Tender;
  Flow                  : Decimal(10, 2);    // e.g., 30 m3/h
  Head                  : Decimal(10, 2);    // e.g., 50 m WC
  SupplyFrequency       : String;           // e.g., 50 Hz
  RatedVoltage          : String;           // e.g., 400 V
  pump : Composition of one Pump on pump.requirement = $self;
}

entity Pump : cuid {
  requirement : Association to Requirement;
  PumpFamily            : String;
  InletWidth            : String;            // e.g., "50 mm, DN 50"
  OutletWidth           : String;            // e.g., "65 mm, ..."
  MotorPerformance      : String;            // e.g., "2.2 kW, 160 KJ"
  MotorPoles            : String;           // e.g., number of motor poles
  ImpellerDesign        : String;            // e.g., KAMA RAD
  ImpellerTrim          : String;     // e.g., 200 mm, trimmed to specific size
  InstallationType      : String;            // e.g., "Block V Pump only"
  MotorEfficiency       : String;            // e.g., IE3, IE4
  MaxInletPressure      : String;     // e.g., PN10, p (ac)
  MaxOutletPressure     : String;     // e.g., PN10, p (dc)
  ShaftAxisPosition     : String;            // e.g., H, V
  Materials             : String;            // e.g., G, G1A1, etc.
  GrossPrice            : Decimal(15, 2);
  NetPrice              : Decimal(15, 2);
  COGS                  : Decimal(15, 2);    // Cost of Goods Sold
  LeadTime              : Integer;           // Days or weeks, depending on business rules
}
