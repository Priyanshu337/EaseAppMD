import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";
import "./Footer.css";
import MinimizableWebChat from './MinimizableWebChat'

export default function App() {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-start text-muted">
      <MinimizableWebChat />
      <div className="text-center p-4 copy-right">
        ApptEaseMD © 2023 Copyright: All rights reserved.
      </div>
    </MDBFooter>
  );
}
