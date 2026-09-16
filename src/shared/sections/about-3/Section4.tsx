import React from "react";
import RevealText from "@/shared/effects/RevealText";
import OdometerCounter from "@/shared/elements/OdometerCounter";

// About 3 Section 4 - Stats (Years of Practice, Deployments, Partners)

const STATS = [
    { count: 60, prefix: undefined as React.ReactNode, suffix: "K+", label: "Merchants on Payment Infrastructure" },
    { count: 800, prefix: undefined as React.ReactNode, suffix: "K", label: "Push Notifications per Run" },
    { count: 600, prefix: undefined as React.ReactNode, suffix: "K+", label: "Concurrent Sessions Handled" },
    { count: 30, prefix: undefined as React.ReactNode, suffix: "%", label: "Fewer Payment Errors" },
    { count: 3, prefix: undefined as React.ReactNode, suffix: "+", label: "Years of Experience" },
];

export default function Section4() {
    return (
        <section className="sec-4-about pt-120 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <h3 className="reveal-text">
                            <RevealText>
                                Impact in numbers, from systems running in production
                            </RevealText>
                        </h3>
                    </div>
                    <div className="pt-100">
                        <div className="d-flex flex-wrap align-items-center justify-content-lg-between justify-content-center gap-md-5 gap-4">
                            {STATS.map((item, i) => (
                                <div key={i} className="text-center">
                                    <h1 className="fw-600 mb-0">
                                        <OdometerCounter
                                            count={item.count}
                                            prefix={item.prefix}
                                            suffix={item.suffix}
                                        />
                                    </h1>
                                    <h6 className="fw-500 fz-font-md neutral-500 mb-0">{item.label}</h6>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
