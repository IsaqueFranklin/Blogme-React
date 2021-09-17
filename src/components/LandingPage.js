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
                <Row style={{marginTop: 30}}>
                    <Col style={{alignItems: 'center', justifyContent: 'center', marginTop: 100, marginLeft: 15, marginRight: 15}}>
                        <h1>Share ideas people can connect with</h1>
                        <br></br>
                        <p>Start your blog for free and begin to share what you have to say. Create your own blog, personalize it, and write your posts with freedom of content. Our platform will deliver your posts to new users daily.</p>
                        <br></br>
                        <a href="/login"><button className="landingButton">Try it out</button></a>
                    </Col>
                    <Col md="auto">
                        <img className="landingImg" src="img/phone1.png" alt="phone img" style={{width: 270, height: 480, marginTop: 50}} />
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
                <Row style={{marginTop: 30, marginBottom: 78}}>
                    <Col md="auto" style={{marginTop: 0}}>
                        <img className="landingImg4 sol" src="img/banner1.png" alt="phone img" style={{width: 400, height: 200, borderRadius: 8, marginTop: 70}} />
                    </Col>

                    <Col className="links" style={{alignItems: 'center', justifyContent: 'center', marginTop: 30,}}>
                        <h1>Connect with others</h1>
                        <br></br>
                        <p>You can follow other users, like their posts, write a comment and start a conversation, share their posts and even get to make new friends with them.</p>
                        <a href="/"><button className="landingButton2">Give it a look</button></a>
                    </Col>
                </Row>
                <br></br>
                </Card.Body>
            </Card>
            </Container>
        </div>

        <div>
            <Container>
            <Card className="homecard2 links" style={{marginTop: 60,}}>
                <Card.Body>
                {/*<h3>This is Blogme</h3>*/}
                <Row style={{marginTop: 30, marginBottom: 20,}}>
                    <Col md="auto" style={{alignItems: 'center', justifyContent: 'center', marginTop: 20, marginLeft: 30, marginRight: 30}}>
                        <h1>Get personal</h1>
                        <br></br>
                        <p>This is a place where you can connect and follow people based on their texts and ideas, discover new ideas and follow new people.</p>
                        <br></br>
                        <a href="/login"><button className="landingButton2">Try it out</button></a>
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
                <Row style={{marginTop: 10, marginBottom: 30}}>
                    <Col md="auto">
                        <img className="landingImg3" src="img/video.gif" alt="phone img" style={{width: 270, height: 480, marginTop: 0}} />
                    </Col>

                    <Col style={{alignItems: 'center', justifyContent: 'center', marginTop: 100, marginLeft: 15, marginRight: 15}}>
                        <h1>Write your own stories</h1>
                        <br></br>
                        <p>You can write about pieces of your life, stories, something that happened with you yesterday at the restaurant, anything that will create a connection with your audience.</p>
                        <br></br>
                        <a href="/login"><button className="landingButton2">Write now</button></a>
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
