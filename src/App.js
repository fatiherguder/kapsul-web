import './App.css';
import React, { useEffect } from 'react';
import MemberContextProvider from './context/MemberContext';
import Base from './base';
import ARGEContact from './views/contact/ar_ge_contact';
import BusinessIdeaContact from './views/contact/business_idea_contact';
import PersonalContact from './views/contact/personal_contact';
import TeamContact from './views/contact/team_contact';
import Aos from "aos";
import { AnimatePresence } from 'framer-motion';
import "aos/dist/aos.css";
import { useLocation, Switch, Route } from "react-router-dom";

const App = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, [])

  const location = useLocation();


  return (
    <div className="App">
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route exact path='/'>
            <Base />
          </Route>
          <MemberContextProvider>
            <Route path="/apply/personal">
              <PersonalContact />
            </Route>
            <Route path="/apply/team">
              <TeamContact />
            </Route>
            <Route path="/apply/business">
              <BusinessIdeaContact />
            </Route>
            <Route path="/apply/arge">
              < ARGEContact />
            </Route>
          </MemberContextProvider>
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;
