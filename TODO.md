# TODO: Update Certificate Management Card Navigation

## Steps to Complete

- [x] Update App.tsx to add route for /certificate-management pointing to CertificateManagement component
- [x] Update HomePage.tsx to replace alert with navigation to /certificate-management using useNavigate
- [ ] Test navigation by clicking the Certificate Management card in the dashboard
- [ ] Verify the Certificate Management page loads with analytics, action bar, recent certificates, and upload form

## Notes
- Keep the existing /certificates route or replace it with /certificate-management as per task requirements
- No UI changes to the card in StudentDashboardSection.tsx
- Use React Router's useNavigate hook for programmatic navigation
