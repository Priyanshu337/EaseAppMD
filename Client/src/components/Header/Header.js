import React, { useState} from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse
} from 'mdb-react-ui-kit';
import './Header.css'; 
import companyLogo from '../../assets/logo.png'

export default function Header({ userId, onLogout }) {
  const [showNav, setShowNav] = useState(false);
  
  return (
    <MDBNavbar expand='lg' light bgColor='light' className='navbar-custom'>
      <MDBContainer fluid>
        <MDBNavbarNav className='me-auto'>
          <MDBNavbarItem>
            <MDBNavbarLink href='#' className='nav-link-custom'>
              <img
                src={companyLogo}
                alt='Company Logo'
                className='logo'
                height={100}
              />
            </MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>

        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNav(!showNav)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav className='ms-auto'>
            {userId ? (
              // Navbar for logged-in users
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/doctor-dashboard' className='nav-link-custom'>
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='#' className='nav-link-custom'>
                    About
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/doctor-dashboard' className='nav-link-custom'>
                    Doctors
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/appointmentCalendar' className='nav-link-custom'>
                    Appointments
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/login' onClick={onLogout} className='nav-link-custom'>
                    Logout
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            ) : (
              // Navbar for guests
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/login' className='nav-link-custom'>
                    Login
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/register' className='nav-link-custom'>
                    Signup
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
