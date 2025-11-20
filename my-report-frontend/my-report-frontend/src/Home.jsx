import React from "react";
import Header from "./Header";
import ReportCard from "./ReportCard";
import "./Home.css"

export default function Home() {
    return (
        <main>
            <Header></Header>

            <div className="container-fluid">
                <div className="row">
                    <div class="overflow-auto following-overflow col-2">
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                        <div className="following-user"></div>
                    </div>
                    <div class="overflow-auto reports-overflow col-10">
                        <ReportCard></ReportCard>
                    </div>
                </div>
            </div>
        </main>
    )
}