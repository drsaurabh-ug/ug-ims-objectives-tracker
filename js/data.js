// United Gears IMS Tracker - Data Module
// Document: UG/IMS/OBJ/2025-26
// FY 2025-26: April 2025 - March 2026

const MONTHS = ['Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26'];

// Division Configuration - Single source of truth for all division data
const DIVISIONS_CONFIG = {
    gear: {
        id: 'gear',
        name: 'Gear Division',
        shortName: 'Gear',
        icon: 'fa-cog',
        colorClass: 'gear'
    },
    lop: {
        id: 'lop',
        name: 'LOP Division',
        shortName: 'LOP',
        icon: 'fa-industry',
        colorClass: 'lop'
    },
    hydraulic: {
        id: 'hydraulic',
        name: 'Hydraulic Pump Division',
        shortName: 'Hydraulic Pump',
        icon: 'fa-water',
        colorClass: 'hydraulic'
    },
    cw: {
        id: 'cw',
        name: 'Company Wide',
        shortName: 'Company Wide',
        icon: 'fa-building',
        colorClass: 'company-wide'
    }
};

const DIVISIONS = ['Gear Division', 'LOP Division', 'Hydraulic Pump Division'];

// App Configuration
const APP_CONFIG = {
    defaultTheme: 'dark',
    pageTitle: 'IMS Objectives Tracker',
    tagline: 'Integrated Management System - Objectives Tracker'
};

// ============================================
// QUALITY OBJECTIVES DATA - ISO 9001:2015
// ============================================

const qualityObjectives = {
    customerComplaints: {
        title: 'Customer Complaints',
        metric: 'Number of Complaints per Month',
        unit: 'Nos.',
        target: '≤ 3 per month',
        responsibility: 'Quality Manager',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 3,
                actual: [1, 1, 1, 1, 1, 1, 1, 1, 0, null, null, null],
                ytd: 8,
                status: 'On Track'
            },
            'LOP Division': {
                target: 3,
                actual: [0, 0, 0, 0, 0, 2, 0, 0, 0, null, null, null],
                ytd: 2,
                status: 'Excellent'
            },
            'Hydraulic Pump Division': {
                target: 3,
                actual: [1, 0, 0, 0, 0, 1, 1, 0, 0, null, null, null],
                ytd: 3,
                status: 'Excellent'
            }
        },
        // remarks: [
        //     { month: 'May-25', text: 'LOP Division: 4 complaints received - Root cause: Dimensional deviation in LOP-2345 batch. CAPA Ref: CAPA/LOP/2025/012' },
        //     { month: 'Oct-25', text: 'LOP Division: 4 complaints - Surface finish issues. Supplier audit conducted. CAPA Ref: CAPA/LOP/2025/038' },
        //     { month: 'Sep-25', text: 'Hydraulic Pump Division: Zero complaints achieved - Best performer award initiated' }
        // ]
    },
    
    firstPassYield: {
        title: 'First Pass Yield (FPY)',
        metric: 'Percentage of units passing first inspection',
        unit: '%',
        target: '≥ 98%',
        responsibility: 'Production Manager',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 98,
                actual: [98.3, 98.57, 98.89, 97.91, 98.31, 98.13, 98.21, 96.87, null, null, null, null],
                ytd: 98.15,
                status: 'On Track'
            },
            'LOP Division': {
                target: 98,
                actual: [99.21, 99.39, 99.32, 99.27, 99.52, 99.76, 98.99, 99.67, null, null, null, null],
                ytd: 99.39,
                status: 'Excellent'
            },
            'Hydraulic Pump Division': {
                target: 98,
                actual: [99.37, 99.65, 99.73, 99.89, 99.52, 99.71, 99.85, 99.78, null, null, null, null],
                ytd: 99.69,
                status: 'Excellent'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'LOP Division: FPY below target due to new operator training phase. Training completion: 15-May-2025' },
        //     { month: 'Jul-25', text: 'Gear Division crossed 96% target - Process improvement project PIP/GD/2025/05 closed successfully' },
        //     { month: 'Dec-25', text: 'Hydraulic Pump Division achieved 98.2% - Best in company history' }
        // ]
    },
    
    internalRejection: {
        title: 'Internal Rejection Rate',
        metric: 'Percentage of internal rejections',
        unit: '%',
        target: '≤ 1.5%',
        responsibility: 'Quality Engineer',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 1.5,
                actual: [1.83, 1.79, 0.86, 2.08, 1.69, 1.89, 1.78, 3.11, null, null, null, null],
                ytd: 1.88,
                status: 'Needs Improvement'
            },
            'LOP Division': {
                target: 1.5,
                actual: [0.79, 0.61, 0.68, 0.73, 0.48, 0.24, 1.01, 0.33, null, null, null, null],
                ytd: 0.61,
                status: 'Excellent'
            },
            'Hydraulic Pump Division': {
                target: 1.5,
                actual: [0.63, 0.35, 0.27, 0.11, 0.48, 0.29, 0.15, 0.22, null, null, null, null],
                ytd: 0.31,
                status: 'Excellent'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'LOP Division: Higher rejection due to raw material batch RM/2025/0456 - Supplier NCR raised' },
        //     { month: 'Aug-25', text: 'Gear Division achieved target - New inspection fixtures installed' },
        //     { month: 'Oct-25', text: 'Hydraulic Pump Division: Kaizen project KZ/HPD/2025/08 reduced rejection by 0.3%' }
        // ]
    },
    
    supplierOTD: {
        title: 'Supplier On-Time Delivery',
        metric: 'Percentage of deliveries received on time',
        unit: '%',
        target: '≥ 95%',
        responsibility: 'Purchase Manager',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 95,
                actual: [93.2, 94.1, 94.8, 95.2, 95.6, 95.8, 96.1, 95.9, 96.2, null, null, null],
                ytd: 95.2,
                status: 'On Track'
            },
            'LOP Division': {
                target: 95,
                actual: [94.8, 95.2, 95.6, 96.1, 96.4, 96.8, 97.1, 97.4, 97.2, null, null, null],
                ytd: 96.3,
                status: 'Excellent'
            },
            'Hydraulic Pump Division': {
                target: 95,
                actual: [92.5, 93.2, 93.8, 94.5, 94.2, 94.8, 95.1, 94.9, 95.2, null, null, null],
                ytd: 94.2,
                status: 'Below Target'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'All Divisions: Q1 affected by supply chain disruptions - Alternate vendor development initiated' },
        //     { month: 'Jul-25', text: 'New vendor M/s Precision Steels onboarded - OTD improved by 2%' },
        //     { month: 'Nov-25', text: 'Hydraulic Pump Division: Long-term agreement signed with top 3 suppliers' }
        // ]
    },
    
    internalAudit: {
        title: 'Internal Audit Compliance',
        metric: 'Percentage of audit findings closed on time',
        unit: '%',
        target: '≥ 95%',
        responsibility: 'MR / IMS Coordinator',
        frequency: 'Yearly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 95,
                actual: [null, null, null, null, null, null, 100, null, null, null, null, null],
                ytd: 100,
                status: 'Excellent'
            }
        },
        remarks: [
            { month: 'Oct-25', text: 'FY 2024-25 Internal Audit: 65 findings identified - 5 Non-Conformities (NCs) and 60 Opportunities for Improvement (OFIs).' },
        ]
    },
    
    oee: {
        title: 'Overall Equipment Effectiveness (OEE)',
        metric: 'OEE = Availability × Performance × Quality',
        unit: '%',
        target: '≥ 75%',
        responsibility: 'Maintenance Manager',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 75,
                actual: [28.5, 31.2, 29.8, 33.4, 35.1, 32.7, 36.2, 34.8, null, null, null, null],
                ytd: 32.71,
                status: 'Needs Improvement'
            },
            'LOP Division': {
                target: 75,
                actual: [58.3, 61.7, 64.2, 59.8, 67.5, 70.3, 68.9, 72.1, null, null, null, null],
                ytd: 65.35,
                status: 'Below Target'
            },
            'Hydraulic Pump Division': {
                target: 75,
                actual: [68.2, 71.5, 69.8, 73.4, 75.9, 72.6, 77.3, 78.5, null, null, null, null],
                ytd: 73.4,
                status: 'On Track'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'LOP Division: OEE below target - CNC machine MC-LOP-05 breakdown. Spare parts ordered' },
        //     { month: 'Jun-25', text: 'TPM initiative launched across all divisions - Target: 2% improvement by Q4' },
        //     { month: 'Sep-25', text: 'Hydraulic Pump Division crossed 79% - New hydraulic test bench commissioned' }
        // ]
    }
};

// ============================================
// ENVIRONMENTAL OBJECTIVES DATA - ISO 14001:2015
// ============================================

const environmentalObjectives = {
    electricityConsumption: {
        title: 'Electricity Consumption',
        metric: 'Total kWh consumed per month',
        unit: 'kWh',
        target: 'Data Collection',
        responsibility: 'Utility Manager',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: null,
                actual: [95420, 102350, 118760, 89540, 127830, 108920, 115680, 98750, null, null, null, null],
                ytd: 857250,
                status: 'Data Collection'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Baseline data collection initiated for FY 2025-26' },
        //     { month: 'Aug-25', text: 'Peak consumption due to summer AC load' },
        //     { month: 'Nov-25', text: 'Data analysis in progress - Reduction targets to be set for FY 2026-27' }
        // ]
    },
    
    waterConsumption: {
        title: 'Water Consumption',
        metric: 'Total KL consumed per quarter',
        unit: 'KL',
        target: 'Data Collection',
        responsibility: 'EHS Manager',
        frequency: 'Quarterly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: null,
                actual: [472, null, null, 496, null, null, null, null, null, null, null, null],
                ytd: 968,
                status: 'Data Collection'
            }
        },
        // remarks: [
        //     { month: 'Jun-25', text: 'Q1 consumption: 472 KL - Baseline data recorded' },
        //     { month: 'Sep-25', text: 'Q2 consumption: 496 KL - Slight increase due to cooling requirements' }
        // ]
    },
    
    wasteSegregation: {
        title: 'Waste Segregation Improvement',
        metric: 'Percentage of waste properly segregated',
        unit: '%',
        target: '≥ 95%',
        responsibility: 'EHS Officer',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 95,
                actual: [85, 85, 86, 86, 87, 87, 87, 88, null, null, null, null],
                ytd: 86.38,
                status: 'Below Target'
            }
        },
        wasteCategories: [
            { type: 'Metallic Scrap', qty: '145 MT', disposal: 'Authorized recycler - M/s Metal Recycle India' },
            { type: 'Used Oil', qty: '8.5 KL', disposal: 'Authorized collector - M/s Oil Recovery Systems' },
            { type: 'E-Waste', qty: '0.8 MT', disposal: 'M/s E-Waste Solutions Pvt Ltd' },
            { type: 'Paper/Cardboard', qty: '12 MT', disposal: 'M/s Green Paper Recyclers' },
            { type: 'Plastic Waste', qty: '3.2 MT', disposal: 'M/s Plastic Upcycle Industries' }
        ],
        // remarks: [
        //     { month: 'Apr-25', text: 'Baseline assessment: 88% segregation rate. Improvement plan initiated' },
        //     { month: 'Jul-25', text: 'Color-coded bins installed in all areas. Training conducted for 450 employees' },
        //     { month: 'Oct-25', text: 'Target achieved: 95% segregation rate. Monthly monitoring continues' }
        // ]
    },
    
    hazardousWaste: {
        title: 'Hazardous Waste Disposal Compliance',
        metric: 'Compliance percentage with CPCB/SPCB norms',
        unit: '%',
        target: '100%',
        responsibility: 'EHS Manager',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 100,
                actual: [null, null, null, null, null, null, null, null, null, null, null, null],
                ytd: null,
                status: 'Not Yet Picked'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Hazardous waste tracking to be initiated in FY 2026-27' }
        // ]
    },
    
    paperReduction: {
        title: 'Paper Consumption',
        metric: 'Reams per month',
        unit: 'Reams',
        target: 'Data Collection',
        baseline: 'FY 2024-25: 360 reams/year',
        responsibility: 'Admin Manager',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: null,
                baseline: 360,
                actual: [36, 42, 25, 29, 41, 47, 25, 21, null, null, null, null],
                ytd: 266,
                status: 'Data Collection'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Baseline data collection initiated for FY 2025-26' },
        //     { month: 'Nov-25', text: 'Data analysis in progress - Reduction targets to be set for FY 2026-27' }
        // ]
    }
};

// ============================================
// OH&S OBJECTIVES DATA - ISO 45001:2018
// ============================================

const ohsObjectives = {
    zeroLTI: {
        title: 'Zero Lost Time Injuries (LTI)',
        metric: 'Number of LTI incidents',
        unit: 'Nos.',
        target: 'Zero LTI',
        responsibility: 'EHS Manager',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 0,
                actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, null],
                ytd: 0,
                ltiFreeDays: 275,
                status: 'Achieved'
            }
        },
        safetyStatistics: {
            totalManHours: 892450,
            ltiFrequencyRate: 0,
            severityRate: 0,
            firstAidCases: 12,
            nearMissReported: 156
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Safety Week celebrated 4-10 April. Theme: "Safe Work, Safe Life"' },
        //     { month: 'Jul-25', text: '200 LTI-free days milestone achieved. Safety award ceremony conducted' },
        //     { month: 'Oct-25', text: 'National Safety Day pledge taken by all 650 employees' }
        // ]
    },
    
    safetyInduction: {
        title: 'Safety Induction Compliance',
        metric: 'Percentage of new joiners inducted within 7 days',
        unit: '%',
        target: '100%',
        responsibility: 'HR Manager / EHS Officer',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 100,
                actual: [100, 100, 100, 100, 100, 100, 100, 100, 100, null, null, null],
                ytd: 100,
                status: 'Compliant'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Safety induction module updated with new case studies' },
        //     { month: 'Jun-25', text: 'Bulk recruitment: 12 new operators inducted. Special batch conducted' },
        //     { month: 'Sep-25', text: 'Contractor induction digitized - QR code based attendance tracking' }
        // ]
    },
    
    nearMissReporting: {
        title: 'Near-Miss Reporting',
        metric: 'Number of near-miss reports per month',
        unit: 'Nos.',
        target: '≥ 15 per month',
        responsibility: 'All Employees / EHS Team',
        frequency: 'Monthly',
        isDivisionWise: true,
        data: {
            'Gear Division': {
                target: 15,
                actual: [null, null, null, null, null, 3, 2, 4, 1, null, null, null],
                ytd: 10,
                status: 'Below Target'
            },
            'LOP Division': {
                target: 15,
                actual: [null, null, null, null, null, 2, 5, 1, 3, null, null, null],
                ytd: 11,
                status: 'Below Target'
            },
            'Hydraulic Pump Division': {
                target: 15,
                actual: [null, null, null, null, null, 4, 3, 5, 2, null, null, null],
                ytd: 14,
                status: 'Below Target'
            }
        },
        topNearMissCategories: [
            { category: 'Housekeeping Issues', count: 145, percentage: 28 },
            { category: 'Unsafe Acts', count: 124, percentage: 24 },
            { category: 'Machine Guarding', count: 98, percentage: 19 },
            { category: 'Electrical Hazards', count: 72, percentage: 14 },
            { category: 'Material Handling', count: 84, percentage: 16 }
        ],
        // remarks: [
        //     { month: 'Apr-25', text: 'Near-miss reporting awareness drive conducted. Incentive scheme launched' },
        //     { month: 'Jul-25', text: 'Mobile app for near-miss reporting deployed - Reporting increased by 40%' },
        //     { month: 'Oct-25', text: 'Best near-miss reporter of Q2 awarded - Mr. Suresh Kumar, Gear Division' }
        // ]
    },
    
    preventiveMaintenance: {
        title: 'Preventive Maintenance of Safety Equipment',
        metric: 'Percentage of PM completed on schedule',
        unit: '%',
        target: '100%',
        responsibility: 'Maintenance Manager',
        frequency: 'Monthly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 100,
                actual: [100, 100, 100, 100, 100, 100, 100, 100, 100, null, null, null],
                ytd: 100,
                status: 'Excellent'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'PM schedule revised as per new ISO 45001:2018 requirements' },
        //     { month: 'Jul-25', text: 'Fire extinguisher refilling: 25 units refilled by M/s Fire Safety India' },
        //     { month: 'Oct-25', text: 'Annual fire hydrant system testing by third party - Certificate received' }
        // ]
    },
    
    emergencyDrill: {
        title: 'Emergency Drill Participation',
        metric: 'Percentage of employees participating',
        unit: '%',
        target: '≥ 90%',
        responsibility: 'EHS Manager',
        frequency: 'Quarterly',
        isDivisionWise: false,
        data: {
            'Company Wide': {
                target: 90,
                actual: [92, null, null, 94, null, null, 96, null, null, null, null, null],
                ytd: 94,
                status: 'Excellent'
            }
        },
        // remarks: [
        //     { month: 'Apr-25', text: 'Q1 Fire drill: Assembly point timing improved from 5:10 to 4:32' },
        //     { month: 'Jul-25', text: 'Q2 Chemical spill drill: Spill kit usage demonstrated. 8 first responders trained' },
        //     { month: 'Oct-25', text: 'Q3 Mock drill: Fire brigade involved. Best evacuation time achieved: 3:58' }
        // ]
    }
};

// ============================================
// SUMMARY & AUDIT DATA
// ============================================

const auditTrail = [
    {
        date: '21-Oct-2025',
        type: 'Internal Audit',
        details: 'FY 2025-26 Comprehensive Internal Audit - All Departments',
        auditor: 'Mr. Vikram Singh (Lead Auditor)',
        findings: '5 Major, 60 Minor (Total: 65 findings)',
        status: 'Open'
    },
    {
        date: '21-Nov-2025',
        type: 'Management Review Meeting',
        details: 'First Major MRM of FY 2025-26 - Annual IMS Performance Review',
        attendees: 'MD, All HODs, MR, Division Heads',
        outcome: 'IMS objectives reviewed. Corrective actions approved for all 65 audit findings. Resource allocation confirmed for FY 2026-27 planning'
    }
];

// References
const references = {
    imsManual: {
        title: 'IMS Manual',
        documentNo: 'UG/CW/MG/MAN/001',
        issue: '01',
        revision: '01'
    }
};

// Company Information
const companyInfo = {
    name: 'United Gears',
    address: {
        line1: 'Plot No. 188, Phase - 1',
        line2: 'Industrial Area, Panchkula, Haryana - 134113',
        country: 'India'
    },
    documentControl: {
        formatNo: 'UG/FMT/REG/068',
        documentNo: 'UG/CW/MG/REG/035',
        revision: '000',
        issue: '001',
        preparedBy: 'Dr. Saurabh Gupta',
        preparedByTitle: 'IMS Coordinator',
        approvedBy: 'Rajive Jain',
        approverTitle: 'Managing Director',
        effectiveDate: '01-Apr-2025',
        reviewPeriod: 'FY 2025-26 (Apr 2025 - Mar 2026)'
    },
    financialYear: {
        start: 'April 2025',
        end: 'March 2026',
        label: 'FY 2025-26'
    }
};

// Export for use in app.js
window.trackerData = {
    months: MONTHS,
    divisions: DIVISIONS,
    divisionsConfig: DIVISIONS_CONFIG,
    appConfig: APP_CONFIG,
    quality: qualityObjectives,
    environmental: environmentalObjectives,
    ohs: ohsObjectives,
    auditTrail: auditTrail,
    company: companyInfo,
    references: references
};
