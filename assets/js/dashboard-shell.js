/**
 * CarGloss - Dashboard Shell
 * Builds the shared top bar and sidebar for every dashboard page.
 * Each page sets data-dash="customer|admin" and data-page="<section key>".
 */
(function () {
  'use strict';

  var body = document.body;
  var dash = body.getAttribute('data-dash');
  if (!dash) return;

  var current = body.getAttribute('data-page') || '';

  var config = {
    customer: {
      paths: {
        overview: 'customer-dashboard.html',
        tracking: 'customer-tracking.html',
        garage: 'customer-garage.html',
        booking: 'customer-booking.html',
        history: 'customer-history.html',
        settings: 'customer-settings.html'
      },
      pages: [
        { key: 'overview', icon: 'fa-gauge-high', label: 'Overview' },
        { key: 'tracking', icon: 'fa-van-shuttle', label: 'Live Van Tracking' },
        { key: 'garage', icon: 'fa-warehouse', label: 'My Digital Garage' },
        { key: 'booking', icon: 'fa-calendar-days', label: 'Booking Calendar' },
        { key: 'history', icon: 'fa-file-invoice-dollar', label: 'Service History' },
        { key: 'settings', icon: 'fa-sliders', label: 'Rewards & Settings' }
      ],
      user: {
        initials: 'MR',
        name: 'Marcus R.',
        role: 'Gold Tier Member',
        style: 'background:var(--electric-fill);color:white;'
      }
    },
    admin: {
      paths: {
        kpis: 'admin-dashboard.html',
        fleet: 'admin-fleet.html',
        dispatch: 'admin-dispatch.html',
        revenue: 'admin-revenue.html',
        crm: 'admin-customers.html',
        controls: 'admin-controls.html'
      },
      pages: [
        { key: 'kpis', icon: 'fa-chart-line', label: 'Operations KPIs' },
        { key: 'fleet', icon: 'fa-van-shuttle', label: 'Fleet Telemetry' },
        { key: 'dispatch', icon: 'fa-calendar-check', label: "Today's Dispatch" },
        { key: 'revenue', icon: 'fa-chart-pie', label: 'Revenue Analytics' },
        { key: 'crm', icon: 'fa-users', label: 'Client CRM' },
        { key: 'controls', icon: 'fa-sliders', label: 'System Controls' }
      ],
      user: {
        initials: 'DC',
        name: 'Damien Cole',
        role: 'HQ Admin',
        style: 'background:linear-gradient(135deg,var(--electric-fill),#1e40af);color:white;'
      }
    }
  };

  var data = config[dash];
  if (!data) return;

  var topbar = document.getElementById('dash-topbar');
  if (topbar) {
    topbar.innerHTML =
      '<div class="dash-topbar-left">' +
        '<button id="sidebar-toggle" class="dash-hamburger" aria-label="Open dashboard menu"><i class="fa-solid fa-bars"></i></button>' +
        '<a href="../index.html" class="navbar-logo dash-brand" aria-label="CarGloss home">' +
          '<div class="navbar-logo-icon" style="width:34px;height:34px;font-size:1rem"><i class="fa-solid fa-car-side"></i></div>' +
          '<span class="navbar-logo-text" style="font-size:1.1rem">Car<span>Gloss</span></span>' +
        '</a>' +
      '</div>' +
      '<div class="dash-topbar-right">' +
        '<span class="tag tag-blue dash-portal-tag"><i class="fa-solid fa-' + (dash === 'admin' ? 'shield-halved' : 'crown') + '"></i> ' + (dash === 'admin' ? 'Admin Console' : 'Customer Portal') + '</span>' +
        '<button class="theme-toggle-btn" data-theme-toggle aria-label="Toggle theme"><span data-theme-icon><i class="fa-solid fa-sun"></i></span></button>' +
        '<button class="rtl-toggle-btn" data-rtl-toggle aria-label="Toggle RTL">RTL</button>' +
      '</div>';
  }

  var sidebar = document.getElementById('dashboard-sidebar');
  if (sidebar) {
    var nav = data.pages.map(function (p) {
      var active = p.key === current;
      return '<li class="sidebar-nav-item">' +
        '<a href="' + data.paths[p.key] + '" class="sidebar-nav-link' + (active ? ' active' : '') + '"' + (active ? ' aria-current="page"' : '') + '>' +
          '<i class="fa-solid ' + p.icon + ' nav-icon"></i> ' + p.label +
        '</a>' +
      '</li>';
    }).join('');

    sidebar.innerHTML =
      '<a href="../index.html" class="navbar-logo sidebar-brand">' +
        '<div class="navbar-logo-icon"><i class="fa-solid fa-car-side"></i></div>' +
        '<span class="navbar-logo-text">Car<span>Gloss</span></span>' +
      '</a>' +
      '<div class="sidebar-user">' +
        '<div class="avatar avatar-sm" style="' + data.user.style + '">' + data.user.initials + '</div>' +
        '<div>' +
          '<div class="sidebar-user-name">' + data.user.name + '</div>' +
          '<div class="sidebar-user-role">' + data.user.role + '</div>' +
        '</div>' +
      '</div>' +
      '<ul class="sidebar-nav">' +
        '<li class="sidebar-section-label">Menu</li>' +
        nav +
        '<li class="sidebar-section-label">Account</li>' +
        '<li class="sidebar-nav-item"><a href="../index.html" class="sidebar-nav-link"><i class="fa-solid fa-house nav-icon"></i> View Site</a></li>' +
        '<li class="sidebar-nav-item"><a href="login.html" class="sidebar-nav-link"><i class="fa-solid fa-right-from-bracket nav-icon"></i> Sign Out</a></li>' +
      '</ul>';
  }
})();
