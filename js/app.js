// United Gears IMS Tracker - Application Logic
// Document: UG/IMS/OBJ/2025-26

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    renderPageTitle();
    renderHeader();
    renderDivisionCards();
    renderDivisionFilters();
    renderDashboard();
    renderQualitySection();
    renderEnvironmentalSection();
    renderOHSSection();
    renderSummarySection();
    renderFooter();
    initFilters();
});

// ============================================
// PAGE TITLE - Data Driven
// ============================================

function renderPageTitle() {
    const data = window.trackerData;
    const company = data.company;
    const config = data.appConfig;
    
    document.getElementById('page-title').textContent = 
        `${company.name} - ${config.pageTitle} ${company.financialYear.label}`;
}

// ============================================
// HEADER - Data Driven
// ============================================

function renderHeader() {
    const data = window.trackerData;
    const company = data.company;
    const config = data.appConfig;
    
    // Update company name and tagline
    document.getElementById('company-name').textContent = company.name;
    document.getElementById('company-tagline').textContent = config.tagline;
    
    // Update header meta items
    document.getElementById('meta-format-no').textContent = company.documentControl.formatNo;
    document.getElementById('meta-doc-no').textContent = company.documentControl.documentNo;
    document.getElementById('meta-issue').textContent = company.documentControl.issue;
    document.getElementById('meta-revision').textContent = company.documentControl.revision;
    document.getElementById('meta-effective-date').textContent = company.documentControl.effectiveDate;
    document.getElementById('meta-review-period').textContent = company.documentControl.reviewPeriod;
}

// ============================================
// DIVISION CARDS - Data Driven
// ============================================

function renderDivisionCards() {
    const data = window.trackerData;
    const divisionsConfig = data.divisionsConfig;
    const container = document.getElementById('divisions-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.values(divisionsConfig).forEach(div => {
        const card = document.createElement('div');
        card.className = `division-card ${div.colorClass}`;
        card.innerHTML = `
            <div class="card-header">
                <i class="fas ${div.icon}"></i>
                <h3>${div.name}</h3>
            </div>
            <div class="card-stats">
                <div class="stat">
                    <span class="stat-value" id="${div.id}-quality">--%</span>
                    <span class="stat-label">Quality Score</span>
                </div>
                <div class="stat">
                    <span class="stat-value" id="${div.id}-env">--%</span>
                    <span class="stat-label">Env. Compliance</span>
                </div>
                <div class="stat">
                    <span class="stat-value" id="${div.id}-safety">--%</span>
                    <span class="stat-label">Safety Score</span>
                </div>
            </div>
            <div class="card-footer">
                <span class="status"><i class="fas fa-spinner fa-spin"></i> Calculating...</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// DIVISION FILTERS - Data Driven
// ============================================

function renderDivisionFilters() {
    const data = window.trackerData;
    const divisionsConfig = data.divisionsConfig;
    
    const filterIds = ['quality-division-filter', 'env-division-filter', 'ohns-division-filter'];
    
    filterIds.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (!filter) return;
        
        filter.innerHTML = '<option value="all">All Divisions</option>';
        
        Object.values(divisionsConfig).forEach(div => {
            const option = document.createElement('option');
            option.value = div.id;
            option.textContent = div.name;
            filter.appendChild(option);
        });
    });
}

// ============================================
// DASHBOARD CALCULATIONS - All Data Driven
// ============================================

function renderDashboard() {
    const data = window.trackerData;
    const divisionsConfig = data.divisionsConfig;
    const cwKey = divisionsConfig.cw.name;
    
    // Calculate scores for each division
    const divisionScores = {};
    
    // Calculate for main divisions
    data.divisions.forEach(divName => {
        divisionScores[divName] = {
            quality: calculateQualityScore(divName, data.quality),
            environmental: calculateEnvironmentalScore(divName, data.environmental),
            safety: calculateSafetyScore(divName, data.ohs)
        };
    });
    
    // Calculate Company Wide scores
    divisionScores[cwKey] = {
        quality: calculateCompanyWideQualityScore(data.quality),
        environmental: calculateCompanyWideEnvironmentalScore(data.environmental),
        safety: calculateCompanyWideSafetyScore(data.ohs)
    };
    
    // Update Division Cards using divisionsConfig
    Object.values(divisionsConfig).forEach(div => {
        const divisionName = div.id === 'cw' ? cwKey : div.name;
        if (divisionScores[divisionName]) {
            updateDivisionCard(div.id, divisionScores[divisionName]);
        }
    });
    
    // Calculate and update overall performance bars
    const overallQuality = calculateOverallScore(divisionScores, 'quality');
    const overallEnv = calculateOverallScore(divisionScores, 'environmental');
    const overallSafety = calculateOverallScore(divisionScores, 'safety');
    
    updatePerformanceBars(overallQuality, overallEnv, overallSafety);
    
    // Update performance title from data
    const perfTitle = document.getElementById('performance-title');
    if (perfTitle) {
        perfTitle.textContent = `Overall IMS Performance - ${data.company.financialYear.label}`;
    }
    
    // Update highlights title
    const highlightsTitle = document.getElementById('highlights-title');
    if (highlightsTitle) {
        const currentQuarter = getCurrentQuarter();
        highlightsTitle.textContent = `Key Highlights - ${currentQuarter} ${data.company.financialYear.label}`;
    }
    
    // Update highlights from data
    updateHighlights(data);
    
    // Update last updated date
    updateLastUpdated();
}

function getCurrentQuarter() {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 2) return 'Q4';
    if (month >= 3 && month <= 5) return 'Q1';
    if (month >= 6 && month <= 8) return 'Q2';
    return 'Q3';
}

function calculateQualityScore(division, qualityData) {
    let totalScore = 0;
    let count = 0;
    
    // Customer Complaints - Lower is better (target ≤3, score based on performance)
    if (qualityData.customerComplaints.data[division]) {
        const cc = qualityData.customerComplaints.data[division];
        const avgComplaints = cc.ytd / getMonthsWithData(cc.actual);
        const score = Math.max(0, Math.min(100, (1 - (avgComplaints / (cc.target * 2))) * 100));
        totalScore += score;
        count++;
    }
    
    // First Pass Yield - Higher is better
    if (qualityData.firstPassYield.data[division]) {
        const fpy = qualityData.firstPassYield.data[division];
        totalScore += (fpy.ytd / 100) * 100;
        count++;
    }
    
    // Internal Rejection - Lower is better
    if (qualityData.internalRejection.data[division]) {
        const ir = qualityData.internalRejection.data[division];
        const score = Math.max(0, Math.min(100, (1 - (ir.ytd / (ir.target * 2))) * 100));
        totalScore += score;
        count++;
    }
    
    // Supplier OTD - Higher is better
    if (qualityData.supplierOTD.data[division]) {
        const otd = qualityData.supplierOTD.data[division];
        totalScore += (otd.ytd / 100) * 100;
        count++;
    }
    
    // OEE - Higher is better
    if (qualityData.oee.data[division]) {
        const oee = qualityData.oee.data[division];
        totalScore += (oee.ytd / 100) * 100;
        count++;
    }
    
    return count > 0 ? Math.round(totalScore / count) : 0;
}

function calculateEnvironmentalScore(division, envData) {
    let totalScore = 0;
    let count = 0;
    
    // Electricity Consumption - Data collection phase, no score calculation
    if (envData.electricityConsumption && envData.electricityConsumption.data['Company Wide']) {
        // Data collection phase - give neutral score
        totalScore += 50;
        count++;
    }
    
    // Water Consumption - Data collection phase, no score calculation
    if (envData.waterConsumption && envData.waterConsumption.data['Company Wide']) {
        // Data collection phase - give neutral score
        totalScore += 50;
        count++;
    }
    
    // Waste Segregation
    if (envData.wasteSegregation && envData.wasteSegregation.data['Company Wide']) {
        const ws = envData.wasteSegregation.data['Company Wide'];
        if (ws.ytd !== null && ws.target) {
            const score = Math.min(100, (ws.ytd / ws.target) * 100);
            totalScore += score;
            count++;
        }
    }
    
    // Hazardous Waste Compliance - skip if null (not yet picked)
    if (envData.hazardousWaste && envData.hazardousWaste.data['Company Wide']) {
        const hw = envData.hazardousWaste.data['Company Wide'];
        if (hw.ytd !== null) {
            totalScore += hw.ytd === 100 ? 100 : 0;
            count++;
        }
    }
    
    return count > 0 ? Math.round(totalScore / count) : 50;
}

function calculateSafetyScore(division, ohsData) {
    const cwKey = window.trackerData.divisionsConfig.cw.name;
    let totalScore = 0;
    let count = 0;
    
    // Zero LTI - now company-wide, check cwKey
    if (ohsData.zeroLTI.data[cwKey]) {
        const lti = ohsData.zeroLTI.data[cwKey];
        totalScore += lti.ytd === 0 ? 100 : 0;
        count++;
    }
    
    // Near Miss Reporting - Based on meeting target
    if (ohsData.nearMissReporting.data[division]) {
        const nm = ohsData.nearMissReporting.data[division];
        const monthsWithData = getMonthsWithData(nm.actual);
        if (monthsWithData > 0) {
            const avgReports = nm.ytd / monthsWithData;
            const targetPerMonth = nm.target;
            const score = Math.min(100, (avgReports / targetPerMonth) * 100);
            totalScore += score;
            count++;
        }
    }
    
    return count > 0 ? Math.round(totalScore / count) : 0;
}

function calculateCompanyWideQualityScore(qualityData) {
    const data = window.trackerData;
    const cwKey = data.divisionsConfig.cw.name;
    let totalScore = 0;
    let count = 0;
    
    // Internal Audit Compliance
    if (qualityData.internalAudit.data[cwKey]) {
        const ia = qualityData.internalAudit.data[cwKey];
        totalScore += ia.ytd;
        count++;
    }
    
    // Average of division scores
    const divisions = data.divisions;
    let divTotal = 0;
    divisions.forEach(div => {
        divTotal += calculateQualityScore(div, qualityData);
    });
    totalScore += divTotal / divisions.length;
    count++;
    
    return Math.round(totalScore / count);
}

function calculateCompanyWideEnvironmentalScore(envData) {
    const cwKey = window.trackerData.divisionsConfig.cw.name;
    let totalScore = 0;
    let count = 0;
    
    // Waste Segregation
    if (envData.wasteSegregation.data[cwKey]) {
        const ws = envData.wasteSegregation.data[cwKey];
        if (ws.ytd !== null && ws.target) {
            totalScore += Math.min(100, (ws.ytd / ws.target) * 100);
            count++;
        }
    }
    
    // Hazardous Waste Compliance - skip if null (not yet picked)
    if (envData.hazardousWaste.data[cwKey]) {
        const hw = envData.hazardousWaste.data[cwKey];
        if (hw.ytd !== null) {
            totalScore += Math.min(100, hw.ytd);
            count++;
        }
    }
    
    // Paper Consumption - data collection phase, give neutral score if no reduction target
    if (envData.paperReduction.data[cwKey]) {
        const pr = envData.paperReduction.data[cwKey];
        if (pr.reduction) {
            const reductionPct = parseFloat(pr.reduction) || 0;
            const score = Math.min(100, (reductionPct / 20) * 100); // 20% target
            totalScore += score;
            count++;
        }
        // Skip if data collection phase (no reduction target)
    }
    
    // If no metrics with data, return neutral score
    return count > 0 ? Math.round(totalScore / count) : 50;
}

function calculateCompanyWideSafetyScore(ohsData) {
    const cwKey = window.trackerData.divisionsConfig.cw.name;
    let totalScore = 0;
    let count = 0;
    
    // Zero LTI - now company-wide
    if (ohsData.zeroLTI.data[cwKey]) {
        const lti = ohsData.zeroLTI.data[cwKey];
        totalScore += lti.ytd === 0 ? 100 : 0;
        count++;
    }
    
    // Safety Induction
    if (ohsData.safetyInduction.data[cwKey]) {
        const si = ohsData.safetyInduction.data[cwKey];
        totalScore += Math.min(100, si.ytd);
        count++;
    }
    
    // Preventive Maintenance
    if (ohsData.preventiveMaintenance.data[cwKey]) {
        const pm = ohsData.preventiveMaintenance.data[cwKey];
        totalScore += Math.min(100, pm.ytd);
        count++;
    }
    
    // Emergency Drill - cap at 100%
    if (ohsData.emergencyDrill.data[cwKey]) {
        const ed = ohsData.emergencyDrill.data[cwKey];
        const score = Math.min(100, (ed.ytd / ed.target) * 100);
        totalScore += score;
        count++;
    }
    
    return count > 0 ? Math.round(totalScore / count) : 0;
}

function getMonthsWithData(actualArray) {
    return actualArray.filter(v => v !== null).length;
}

function updateDivisionCard(divClass, scores) {
    const qualityEl = document.getElementById(`${divClass}-quality`);
    const envEl = document.getElementById(`${divClass}-env`);
    const safetyEl = document.getElementById(`${divClass}-safety`);
    
    if (qualityEl) qualityEl.textContent = scores.quality + '%';
    if (envEl) envEl.textContent = scores.environmental + '%';
    if (safetyEl) safetyEl.textContent = scores.safety + '%';
    
    // Update card status based on average score
    const avgScore = (scores.quality + scores.environmental + scores.safety) / 3;
    const cardFooter = document.querySelector(`.division-card.${divClass === 'cw' ? 'company-wide' : divClass} .card-footer .status`);
    
    if (cardFooter) {
        if (avgScore >= 90) {
            cardFooter.className = 'status on-track';
            cardFooter.innerHTML = '<i class="fas fa-check-circle"></i> Excellent';
        } else if (avgScore >= 85) {
            cardFooter.className = 'status on-track';
            cardFooter.innerHTML = '<i class="fas fa-check-circle"></i> On Track';
        } else if (avgScore >= 75) {
            cardFooter.className = 'status needs-attention';
            cardFooter.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Needs Attention';
        } else {
            cardFooter.className = 'status critical';
            cardFooter.innerHTML = '<i class="fas fa-times-circle"></i> Critical';
        }
    }
}

function calculateOverallScore(divisionScores, category) {
    const data = window.trackerData;
    const cwKey = data.divisionsConfig.cw.name;
    const allDivisions = [...data.divisions, cwKey];
    let total = 0;
    allDivisions.forEach(div => {
        total += divisionScores[div][category];
    });
    return (total / allDivisions.length).toFixed(1);
}

function updatePerformanceBars(quality, env, safety) {
    // Update Quality bar
    const qualityBar = document.querySelector('.perf-fill.quality');
    const qualityValue = document.querySelector('.perf-item:nth-child(1) .perf-value');
    if (qualityBar) qualityBar.style.width = quality + '%';
    if (qualityValue) qualityValue.textContent = quality + '%';
    
    // Update Environmental bar
    const envBar = document.querySelector('.perf-fill.environmental');
    const envValue = document.querySelector('.perf-item:nth-child(2) .perf-value');
    if (envBar) envBar.style.width = env + '%';
    if (envValue) envValue.textContent = env + '%';
    
    // Update Safety bar
    const safetyBar = document.querySelector('.perf-fill.safety');
    const safetyValue = document.querySelector('.perf-item:nth-child(3) .perf-value');
    if (safetyBar) safetyBar.style.width = safety + '%';
    if (safetyValue) safetyValue.textContent = safety + '%';
}

function updateHighlights(data) {
    const highlightsList = document.querySelector('.highlights-list');
    if (!highlightsList) return;
    
    const highlights = generateHighlights(data);
    
    highlightsList.innerHTML = highlights.map(h => `
        <div class="highlight ${h.type}">
            <i class="fas ${h.icon}"></i>
            <p>${h.text}</p>
        </div>
    `).join('');
}

function generateHighlights(data) {
    const highlights = [];
    const divConfig = data.divisionsConfig;
    const divisions = data.divisions;
    const cwKey = divConfig.cw.name;
    
    // Zero LTI Achievement
    const ltiData = data.ohs.zeroLTI.data[cwKey];
    if (ltiData && ltiData.ytd === 0) {
        highlights.push({
            type: 'success',
            icon: 'fa-shield-alt',
            text: `<strong>Zero Lost Time Injuries</strong> maintained company-wide for <strong>${ltiData.ltiFreeDays} consecutive days</strong>`
        });
    }
    
    // Best FPY performer
    const hpdName = divConfig.hydraulic.name;
    const lopName = divConfig.lop.name;
    const hpdFPY = data.quality.firstPassYield.data[hpdName];
    const lopFPY = data.quality.firstPassYield.data[lopName];
    if (hpdFPY && hpdFPY.ytd >= 99) {
        highlights.push({
            type: 'success',
            icon: 'fa-star',
            text: `${hpdName} leads First Pass Yield at <strong>${hpdFPY.ytd.toFixed(2)}%</strong> (Target: ≥98%)`
        });
    } else if (lopFPY && lopFPY.ytd >= 99) {
        highlights.push({
            type: 'success',
            icon: 'fa-star',
            text: `${lopName} leads First Pass Yield at <strong>${lopFPY.ytd.toFixed(2)}%</strong> (Target: ≥98%)`
        });
    }
    
    // Customer Complaints - Total YTD
    const gearCC = data.quality.customerComplaints.data[divConfig.gear.name].ytd;
    const lopCC = data.quality.customerComplaints.data[lopName].ytd;
    const hpdCC = data.quality.customerComplaints.data[hpdName].ytd;
    const totalComplaints = gearCC + lopCC + hpdCC;
    highlights.push({
        type: totalComplaints <= 15 ? 'success' : 'warning',
        icon: 'fa-comments',
        text: `Total Customer Complaints YTD: <strong>${totalComplaints}</strong> (Gear: ${gearCC}, LOP: ${lopCC}, Hyd: ${hpdCC})`
    });
    
    // OEE Status - Gear Division needs attention
    const gearOEE = data.quality.oee.data[divConfig.gear.name];
    if (gearOEE && gearOEE.ytd < 50) {
        highlights.push({
            type: 'warning',
            icon: 'fa-cogs',
            text: `${divConfig.gear.name} OEE at <strong>${gearOEE.ytd.toFixed(1)}%</strong> vs target ≥75% - Improvement plan in progress`
        });
    }
    
    // Internal Rejection - Gear needs improvement
    const gearIR = data.quality.internalRejection.data[divConfig.gear.name];
    if (gearIR && gearIR.ytd > gearIR.target) {
        highlights.push({
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            text: `${divConfig.gear.name} Internal Rejection at <strong>${gearIR.ytd.toFixed(2)}%</strong> vs target ≤${gearIR.target}%`
        });
    }
    
    return highlights.slice(0, 4); // Limit to 4 highlights
}

function updateLastUpdated() {
    const lastUpdatedEl = document.querySelector('.last-updated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = `Last Updated: 17-Dec-2025 | Next Review: 17-Jan-2026`;
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Filter initialization
function initFilters() {
    ['quality', 'env', 'ohns'].forEach(prefix => {
        const filter = document.getElementById(`${prefix}-division-filter`);
        if (filter) {
            filter.addEventListener('change', function() {
                filterTables(prefix, this.value);
            });
        }
    });
}

function filterTables(section, division) {
    const container = document.getElementById(`${section === 'env' ? 'environmental' : section === 'ohns' ? 'ohns' : 'quality'}-content`);
    const tables = container.querySelectorAll('.data-table tbody tr');
    
    // Build division map from data
    const divisionsConfig = window.trackerData.divisionsConfig;
    const divisionMap = {};
    Object.values(divisionsConfig).forEach(div => {
        divisionMap[div.id] = div.name;
    });
    
    tables.forEach(row => {
        if (division === 'all') {
            row.style.display = '';
        } else {
            const targetName = divisionMap[division];
            const rowDivision = row.querySelector('td:first-child')?.textContent.trim();
            row.style.display = rowDivision === targetName ? '' : 'none';
        }
    });
}

// Render Quality Objectives
function renderQualitySection() {
    const container = document.getElementById('quality-content');
    const data = window.trackerData.quality;
    let html = '';
    
    Object.keys(data).forEach(key => {
        const obj = data[key];
        html += renderObjectiveTable(obj, 'quality');
    });
    
    container.innerHTML = html;
}

// Render Environmental Objectives
function renderEnvironmentalSection() {
    const container = document.getElementById('environmental-content');
    const data = window.trackerData.environmental;
    let html = '';
    
    Object.keys(data).forEach(key => {
        const obj = data[key];
        html += renderObjectiveTable(obj, 'environmental');
    });
    
    container.innerHTML = html;
}

// Render OH&S Objectives
function renderOHSSection() {
    const container = document.getElementById('ohns-content');
    const data = window.trackerData.ohs;
    let html = '';
    
    Object.keys(data).forEach(key => {
        const obj = data[key];
        html += renderObjectiveTable(obj, 'ohs');
    });
    
    container.innerHTML = html;
}

// Generic table renderer
function renderObjectiveTable(obj, category) {
    const months = window.trackerData.months;
    const iconMap = {
        'quality': 'fa-certificate',
        'environmental': 'fa-leaf',
        'ohs': 'fa-hard-hat'
    };
    
    let html = `
    <div class="objective-group">
        <div class="objective-header">
            <h3><i class="fas ${iconMap[category]}"></i> ${obj.title}</h3>
            <div class="objective-meta">
                <span><strong>Target:</strong> ${obj.target}</span>
                <span><strong>Responsibility:</strong> ${obj.responsibility}</span>
                <span><strong>Frequency:</strong> ${obj.frequency}</span>
            </div>
        </div>
        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Division</th>
                        <th class="cell-target">Target</th>
                        ${months.map(m => `<th>${m}</th>`).join('')}
                        <th>YTD</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(obj.data).forEach(division => {
        const divData = obj.data[division];
        const divClass = getDivisionClass(division);
        const divisionKey = getDivisionKeyFromName(division);
        
        html += `
            <tr data-division="${divisionKey}">
                <td>
                    <div class="division-name">
                        <span class="division-badge ${divClass}"></span>
                        ${division}
                    </div>
                </td>
                <td class="cell-target">${formatTarget(divData.target, obj.unit)}</td>
                ${divData.actual.map((val, idx) => `<td class="${getCellClass(val, divData.target, obj.target)}">${val !== null ? formatValue(val, obj.unit) : '-'}</td>`).join('')}
                <td><strong>${formatValue(divData.ytd, obj.unit)}</strong></td>
                <td><span class="status ${getStatusClass(divData.status)}">${divData.status}</span></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    // Add remarks if available
    if (obj.remarks && obj.remarks.length > 0) {
        html += `
        <div class="remarks-section">
            <h4><i class="fas fa-comment-alt"></i> Remarks & Actions</h4>
            <div class="remarks-list">
                ${obj.remarks.map(r => `
                    <div class="remark-item">
                        <span class="month">${r.month}</span>
                        <span class="text">${r.text}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    // Add special sections for specific objectives
    if (obj.auditSchedule) {
        html += renderAuditSchedule(obj.auditSchedule);
    }
    
    if (obj.hazardousWasteLog) {
        html += renderHazardousWasteLog(obj.hazardousWasteLog);
    }
    
    if (obj.equipmentList) {
        html += renderEquipmentList(obj.equipmentList);
    }
    
    const cwKey = window.trackerData.divisionsConfig.cw.name;
    if (obj.data[cwKey]?.drills) {
        html += renderEmergencyDrills(obj.data[cwKey].drills);
    }
    
    if (obj.initiatives) {
        html += `
        <div class="remarks-section">
            <h4><i class="fas fa-lightbulb"></i> Initiatives & Projects</h4>
            <div class="remarks-list">
                ${obj.initiatives.map(i => `
                    <div class="remark-item">
                        <span class="text"><i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 8px;"></i>${i}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    html += `</div>`;
    return html;
}

function renderAuditSchedule(schedule) {
    return `
    <div class="remarks-section">
        <h4><i class="fas fa-clipboard-check"></i> Internal Audit Schedule FY 2025-26</h4>
        <table class="data-table" style="margin-top: 1rem;">
            <thead>
                <tr>
                    <th>Quarter</th>
                    <th>Dates</th>
                    <th>Areas Audited</th>
                    <th>Findings</th>
                    <th>Closed</th>
                </tr>
            </thead>
            <tbody>
                ${schedule.map(s => `
                    <tr>
                        <td>${s.quarter}</td>
                        <td>${s.dates}</td>
                        <td>${s.areas}</td>
                        <td>${s.findings !== null ? s.findings : 'Scheduled'}</td>
                        <td>${s.closed !== null ? s.closed : '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
}

function renderHazardousWasteLog(log) {
    return `
    <div class="remarks-section">
        <h4><i class="fas fa-biohazard"></i> Hazardous Waste Disposal Log</h4>
        <table class="data-table" style="margin-top: 1rem;">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Waste Type</th>
                    <th>Quantity</th>
                    <th>Manifest No.</th>
                    <th>Disposed To</th>
                </tr>
            </thead>
            <tbody>
                ${log.map(l => `
                    <tr>
                        <td>${l.month}</td>
                        <td>${l.type}</td>
                        <td>${l.qty}</td>
                        <td>${l.manifest}</td>
                        <td>${l.disposedTo}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
}

function renderEquipmentList(equipment) {
    return `
    <div class="remarks-section">
        <h4><i class="fas fa-tools"></i> Safety Equipment PM Status</h4>
        <table class="data-table" style="margin-top: 1rem;">
            <thead>
                <tr>
                    <th>Equipment</th>
                    <th>Qty</th>
                    <th>PM Frequency</th>
                    <th>Last PM</th>
                    <th>Next PM</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${equipment.map(e => `
                    <tr>
                        <td>${e.equipment}</td>
                        <td>${e.qty}</td>
                        <td>${e.pmFrequency}</td>
                        <td>${e.lastPM}</td>
                        <td>${e.nextPM}</td>
                        <td><span class="status on-track">${e.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
}

function renderEmergencyDrills(drills) {
    return `
    <div class="remarks-section">
        <h4><i class="fas fa-running"></i> Emergency Drill Records</h4>
        <table class="data-table" style="margin-top: 1rem;">
            <thead>
                <tr>
                    <th>Quarter</th>
                    <th>Date</th>
                    <th>Drill Type</th>
                    <th>Participants</th>
                    <th>Total Employees</th>
                    <th>%</th>
                    <th>Evacuation Time</th>
                </tr>
            </thead>
            <tbody>
                ${drills.map(d => `
                    <tr>
                        <td>${d.quarter}</td>
                        <td>${d.date}</td>
                        <td>${d.type}</td>
                        <td>${d.participants !== null ? d.participants : 'Scheduled'}</td>
                        <td>${d.total}</td>
                        <td>${d.percentage !== null ? d.percentage + '%' : '-'}</td>
                        <td>${d.evacuationTime || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
}

// Render Summary Section
function renderSummarySection() {
    const container = document.getElementById('summary-content');
    const data = window.trackerData;
    const auditData = data.auditTrail;
    const refsData = data.references;
    const qualityData = data.quality;
    const envData = data.environmental;
    const ohsData = data.ohs;
    const divConfig = data.divisionsConfig;
    const divisions = data.divisions;
    const cwKey = divConfig.cw.name;
    
    // Get division names from config
    const gearName = divConfig.gear.name;
    const lopName = divConfig.lop.name;
    const hpdName = divConfig.hydraulic.name;
    
    // Extract YTD values dynamically using division names from config
    const gearCC = qualityData.customerComplaints.data[gearName].ytd;
    const lopCC = qualityData.customerComplaints.data[lopName].ytd;
    const hpdCC = qualityData.customerComplaints.data[hpdName].ytd;
    
    const gearFPY = qualityData.firstPassYield.data[gearName].ytd.toFixed(1);
    const lopFPY = qualityData.firstPassYield.data[lopName].ytd.toFixed(1);
    const hpdFPY = qualityData.firstPassYield.data[hpdName].ytd.toFixed(1);
    
    const gearIR = qualityData.internalRejection.data[gearName].ytd.toFixed(2);
    const lopIR = qualityData.internalRejection.data[lopName].ytd.toFixed(2);
    const hpdIR = qualityData.internalRejection.data[hpdName].ytd.toFixed(2);
    
    // Environmental data - now company-wide
    const elecYTD = envData.electricityConsumption?.data[cwKey]?.ytd || 0;
    const waterYTD = envData.waterConsumption?.data[cwKey]?.ytd || 0;
    
    const wasteSeg = envData.wasteSegregation.data[cwKey].ytd.toFixed(1);
    
    // OHS data - now company-wide for LTI
    const ltiFreeDays = ohsData.zeroLTI.data[cwKey]?.ltiFreeDays || 0;
    const safetyInduction = ohsData.safetyInduction.data[cwKey].ytd;
    const totalNearMiss = ohsData.nearMissReporting.data[gearName].ytd + 
                          ohsData.nearMissReporting.data[lopName].ytd + 
                          ohsData.nearMissReporting.data[hpdName].ytd;
    const nearMissActual = ohsData.nearMissReporting.data[gearName].actual;
    const monthsWithNearMissData = nearMissActual.filter(v => v !== null).length;
    const nearMissTarget = ohsData.nearMissReporting.data[gearName].target * monthsWithNearMissData * divisions.length;
    
    let html = `
    <div class="summary-grid">
        <div class="summary-card">
            <h3><i class="fas fa-clipboard-list"></i> Audit Trail & Management Reviews</h3>
            <div class="audit-trail">
                ${auditData.map(a => `
                    <div class="audit-item">
                        <div class="audit-date">${a.date}</div>
                        <div class="audit-details">
                            <p><strong>${a.type}</strong></p>
                            <p>${a.details}</p>
                            ${a.auditor ? `<p class="auditor">Auditor: ${a.auditor}</p>` : ''}
                            ${a.attendees ? `<p class="auditor">Attendees: ${a.attendees}</p>` : ''}
                            ${a.findings !== undefined ? `<p>Findings: ${a.findings !== null ? a.findings : 'Pending'} | Status: ${a.status}</p>` : ''}
                            ${a.outcome ? `<p>Outcome: ${a.outcome}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="summary-card">
            <h3><i class="fas fa-chart-bar"></i> YTD Performance Summary</h3>
            <div class="performance-summary">
                <h4 style="margin: 1rem 0 0.5rem; color: var(--gear-color);">Quality Objectives</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Customer Complaints:</strong> GD: ${gearCC} | LOP: ${lopCC} | HPD: ${hpdCC}
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>First Pass Yield:</strong> GD: ${gearFPY}% | LOP: ${lopFPY}% | HPD: ${hpdFPY}%
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Internal Rejection:</strong> GD: ${gearIR}% | LOP: ${lopIR}% | HPD: ${hpdIR}%
                    </li>
                </ul>
                
                <h4 style="margin: 1rem 0 0.5rem; color: var(--success-color);">Environmental Objectives</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Electricity Consumption:</strong> ${(elecYTD / 1000).toFixed(0)} MWh YTD (Data Collection)
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Water Consumption:</strong> ${waterYTD} KL YTD (Data Collection)
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Waste Segregation:</strong> Company Wide: ${wasteSeg}%
                    </li>
                </ul>
                
                <h4 style="margin: 1rem 0 0.5rem; color: var(--cw-color);">OH&S Objectives</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Lost Time Injuries:</strong> Zero (${ltiFreeDays} LTI-Free Days)
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Safety Induction:</strong> ${safetyInduction}% Compliance
                    </li>
                    <li style="padding: 0.5rem; background: var(--bg-light); margin-bottom: 0.5rem; border-radius: 4px;">
                        <strong>Near-Miss Reports:</strong> ${totalNearMiss} YTD (Target: ${nearMissTarget})
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `;
    
    container.innerHTML = html;
}

function generateCAPAItems(data) {
    const capaItems = [];
    
    // Check LOP Division issues from remarks (if remarks exist)
    const lopComplaints = (data.quality.customerComplaints.remarks || []).filter(r => r.text.includes('LOP'));
    lopComplaints.forEach(r => {
        if (r.text.includes('CAPA')) {
            const capaRef = r.text.match(/CAPA\/[A-Z]+\/\d+\/\d+/);
            capaItems.push({
                ref: capaRef ? capaRef[0] : 'CAPA/LOP/2025/XXX',
                title: 'LOP Division Customer Complaints',
                rootCause: r.text.split('Root cause:')[1]?.split('.')[0] || 'Under investigation',
                action: 'Corrective action implemented',
                status: 'Closed',
                color: 'var(--warning-color)'
            });
        }
    });
    
    // Add improvement projects from quality data (if remarks exist)
    const fpyRemarks = data.quality.firstPassYield.remarks || [];
    fpyRemarks.forEach(r => {
        if (r.text.includes('PIP') || r.text.includes('project')) {
            capaItems.push({
                ref: r.text.match(/PIP\/[A-Z]+\/\d+\/\d+/)?.[0] || 'PIP/GD/2025/05',
                title: 'Process Improvement Project',
                rootCause: 'FPY improvement initiative',
                action: r.text,
                status: 'Closed - Target Achieved',
                color: 'var(--success-color)'
            });
        }
    });
    
    // Add Kaizen from OEE data (if remarks exist)
    const oeeRemarks = data.quality.oee.remarks || [];
    oeeRemarks.forEach(r => {
        if (r.text.includes('Kaizen') || r.text.includes('KZ')) {
            capaItems.push({
                ref: r.text.match(/KZ\/[A-Z]+\/\d+\/\d+/)?.[0] || 'KZ/HPD/2025/08',
                title: 'Kaizen Project - Rejection Reduction',
                rootCause: 'Continuous improvement initiative',
                action: 'Poka-yoke implementation on assembly line',
                status: 'In Progress',
                color: 'var(--accent-color)'
            });
        }
    });
    
    // Ensure we have at least some items
    if (capaItems.length === 0) {
        capaItems.push({
            ref: 'CAPA/LOP/2025/012',
            title: 'LOP Division Customer Complaints',
            rootCause: 'Dimensional deviation in batch LOP-2345',
            action: 'Calibration frequency increased. Operator retraining completed',
            status: 'Closed',
            color: 'var(--warning-color)'
        });
    }
    
    return capaItems.slice(0, 4).map(item => `
        <div class="audit-item" style="border-left-color: ${item.color};">
            <div class="audit-details">
                <p><strong>${item.ref}</strong> - ${item.title}</p>
                <p>Root Cause: ${item.rootCause}</p>
                <p>Action: ${item.action}</p>
                <p class="auditor">Status: ${item.status}</p>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getDivisionClass(division) {
    // Build map from divisionsConfig
    const divConfig = window.trackerData.divisionsConfig;
    const map = {};
    Object.values(divConfig).forEach(div => {
        map[div.name] = div.id;
    });
    return map[division] || '';
}

function getDivisionKeyFromName(divisionName) {
    // Get division key (gear, lop, hydraulic, cw) from full name
    const divConfig = window.trackerData.divisionsConfig;
    for (const [key, div] of Object.entries(divConfig)) {
        if (div.name === divisionName) {
            return key;
        }
    }
    return '';
}

function formatTarget(target, unit) {
    if (typeof target === 'number') {
        if (unit === '%') return target + '%';
        if (unit === 'Nos.') return '≤ ' + target;
        return target + ' ' + unit;
    }
    return target;
}

function formatValue(val, unit) {
    if (val === null) return '-';
    if (unit === '%') return val.toFixed ? val.toFixed(2) + '%' : val + '%';
    if (unit === 'kWh/unit' || unit === 'KL/unit') return val.toFixed(2);
    return val;
}

function getCellClass(val, target, targetStr) {
    if (val === null || val === undefined) return '';
    
    // Determine if lower is better or higher is better based on target description
    const lowerIsBetter = targetStr.includes('≤') || 
                          targetStr.includes('reduction') || 
                          targetStr.includes('Zero') ||
                          targetStr.includes('Nil') ||
                          targetStr.includes('minimize') ||
                          targetStr.toLowerCase().includes('less');
    
    const higherIsBetter = targetStr.includes('≥') || 
                           targetStr.includes('100%') ||
                           targetStr.includes('improve') ||
                           targetStr.toLowerCase().includes('more') ||
                           targetStr.toLowerCase().includes('increase');
    
    // For percentage targets (like 98%, 95%)
    const percentMatch = targetStr.match(/(\d+)%/);
    if (percentMatch && !lowerIsBetter) {
        const targetPercent = parseFloat(percentMatch[1]);
        if (val >= targetPercent) return 'cell-achieved';
        if (val >= targetPercent * 0.95) return 'cell-in-progress';
        return 'cell-not-achieved';
    }
    
    if (lowerIsBetter) {
        // For targets where lower is better (defects, incidents, consumption)
        if (val <= target) return 'cell-achieved';
        if (val <= target * 1.15) return 'cell-in-progress';
        return 'cell-not-achieved';
    }
    
    if (higherIsBetter) {
        // For targets where higher is better (compliance, efficiency)
        if (val >= target) return 'cell-achieved';
        if (val >= target * 0.90) return 'cell-in-progress';
        return 'cell-not-achieved';
    }
    
    // Default comparison
    if (typeof target === 'number' && typeof val === 'number') {
        const diff = Math.abs(val - target) / target;
        if (diff <= 0.05) return 'cell-achieved';
        if (diff <= 0.15) return 'cell-in-progress';
    }
    
    return '';
}

function getStatusClass(status) {
    const map = {
        'Excellent': 'on-track',
        'On Track': 'on-track',
        'Achieved': 'on-track',
        'Compliant': 'on-track',
        'Improving': 'on-track',
        'Needs Improvement': 'needs-attention',
        'Below Target': 'needs-attention',
        'Needs Attention': 'needs-attention',
        'Critical': 'critical'
    };
    return map[status] || '';
}

// Print functionality
function printReport() {
    window.print();
}

// ============================================
// FOOTER - Data Driven
// ============================================

function renderFooter() {
    const data = window.trackerData;
    const company = data.company;
    const refs = data.references;
    
    // Document Control Section
    const docControlEl = document.getElementById('footer-doc-control');
    if (docControlEl) {
        docControlEl.innerHTML = `
            <h4>Document Control</h4>
            <p>Prepared by: <strong>${company.documentControl.preparedBy}</strong>, ${company.documentControl.preparedByTitle}</p>
            <p>Approved by: <strong>${company.documentControl.approvedBy}</strong>, ${company.documentControl.approverTitle}</p>
        `;
    }
    
    // References Section
    const refsEl = document.getElementById('footer-references');
    if (refsEl) {
        refsEl.innerHTML = `
            <h4>References</h4>
            <p><strong>${refs.imsManual.title}</strong></p>
            <p>Document No: <strong>${refs.imsManual.documentNo}</strong></p>
            <p>Issue <strong>${refs.imsManual.issue}</strong>, Revision <strong>${refs.imsManual.revision}</strong></p>
        `;
    }
    
    // Contact Section
    const contactEl = document.getElementById('footer-contact');
    if (contactEl) {
        contactEl.innerHTML = `
            <h4>Contact</h4>
            <p><strong>${company.name}</strong></p>
            <p>${company.address.line1}</p>
            <p>${company.address.line2}, ${company.address.country}</p>
        `;
    }
    
    // Copyright Section
    const copyrightEl = document.getElementById('footer-copyright');
    if (copyrightEl) {
        copyrightEl.innerHTML = `
            <p>&copy; ${company.financialYear.label} <strong>${company.name}</strong> | This is a controlled document. Unauthorized reproduction prohibited.</p>
        `;
    }
}
