import React from 'react'
import {Container} from 'react-bootstrap'

function CenteredContainer({ children }) {
    return (
      <div className="fundo">
        <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {children}
      </div>

      </Container>
      </div>
    )
}

export default CenteredContainer