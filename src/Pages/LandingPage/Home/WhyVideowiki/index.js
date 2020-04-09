import React from 'react';
import './style.scss';
import Fade from 'react-reveal/Fade'
export default class WhyVideowiki extends React.Component {
    render() {
        return (
            <div className="why-videowiki" id={this.props.id}>
                <h1 className="why-videowiki-header">
                    Why Video<span className="green">Wiki</span>
                </h1>
                <p className="why-videowiki-desc">
                    VideoWiki has developed a low-cost platform which leverages machine-learning background noise cancellation and remote voice translations
                </p>
                <div>
                    <Fade>
                        <img src="/img/animations/VideoWiki ML animations.gif" style={{ width: '100%', marginTop: '3rem' }} />
                    </Fade>
                </div>
                <div className="reduce-cost">
                    <h2 className="reduce-cost-header">
                        Reduce your costs by <span className="green">10X</span>
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Fade>

                            <img src="/img/animations/10Xcheaperanimation.gif" style={{ width: '70%' }} />
                        </Fade>
                    </div>
                </div>
                <div className="join-us">
                    <h2 className="join-us-header">
                        Join us in making knowledge accessible to the next billion!
                    </h2>
                </div>
            </div>
        )
    }
}