import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Footer from './Footer'


function LandingPage() {
    return (
        <>
        <div style={{backgroundColor: '#0a0a0a', color: '#fff'}}>
            <Container>
            <Card className="homecard3" style={{marginTop: 0, marginBottom: 0, backgroundColor: '#0a0a0a'}}>
                <Card.Body>
                {/*<h3>This is Blogme</h3>*/}
                <Row style={{marginTop: 78}}>
                    <Col style={{alignItems: 'center', justifyContent: 'center', marginTop: 100, marginLeft: 70, marginRight: 70}}>
                        <h1>Share ideas people can connect with</h1>
                        <br></br>
                        <p>Start your blog for free and begin to share what you have to say. Create your own blog, personalize it, and write your posts with freedom of content. Our platform will deliver your posts to new users daily.</p>
                        <br></br>
                        <a href="/login"><button className="landingButton">Try it out</button></a>
                    </Col>
                    <Col md="auto">
                        <img className="landingImg" src="img/phone1.png" alt="phone img" style={{width: 270, height: 480,}} />
                    </Col>
                </Row>
                <br></br>
                </Card.Body>
            </Card>
        </Container>
        </div>

        <div style={{backgroundColor: '#f1f1f1',}}>
            <Container>
            <Card className="homecard3" style={{marginTop: 0, marginBottom: 0, backgroundColor: '#f2f2f2',}}>
                <Card.Body>
                {/*<h3>This is Blogme</h3>*/}
                <Row style={{marginTop: 78, marginBottom: 78}}>
                    <Col md="auto" style={{marginTop: 40}}>
                        <img className="landingImg2 sol" src="img/banner1.png" alt="phone img" style={{width: 400, height: 200, borderRadius: 8,}} />
                    </Col>

                    <Col style={{alignItems: 'center', justifyContent: 'center', marginTop: 0, marginLeft: 70, marginRight: 70}}>
                        <h1>Connect with other people ideas</h1>
                        <br></br>
                        <p>Start your blog for free and begin to share what you have to say. Create your own blog, personalize it, and write your posts with freedom of content.</p>
                        <a href="/login"><button className="landingButton2">Famous users</button></a>
                    </Col>
                </Row>
                <br></br>
                </Card.Body>
            </Card>
        </Container>
        </div>

        <div>
            <Container>
            <Card className="homecard3" style={{marginTop: 0, marginBottom: 0,}}>
                <Card.Body>
                {/*<h3>This is Blogme</h3>*/}
                <Row style={{marginTop: 78, marginBottom: 78}}>
                    <Col style={{alignItems: 'center', justifyContent: 'center', marginTop: 100, marginLeft: 70, marginRight: 70}}>
                        <h1>Write your own stories</h1>
                        <br></br>
                        <p>Start your blog for free and begin to share what you have to say. Create your own blog, personalize it, and write your posts with freedom of content. Our platform will deliver your posts to new users daily.</p>
                        <br></br>
                        <a href="/login"><button className="landingButton2">Write now</button></a>
                    </Col>
                    <Col md="auto">
                        <img className="landingImg3" src="img/phone3.png" alt="phone img" style={{width: 270, height: 480,}} />
                    </Col>
                </Row>
                <br></br>
                </Card.Body>
            </Card>
        </Container>
        </div>
        <Footer />
        </>
    )
}

export default LandingPage
