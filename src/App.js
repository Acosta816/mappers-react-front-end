import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
// import NewPlace from './places/pages/NewPlace';  <--going to lazy-load this instead.
// import UpdatePlace from './places/pages/UpdatePlace';  <--going to lazy-load this instead.
// import UserPlaces from './places/pages/UserPlaces';  <--going to lazy-load this instead.
import MainNavigation from './shared/components/Navigation/MainNavigation.component';
import LoadingSpinner from './shared/components/uiElements/LoadingSpinner.component';
// import Auth from './user/pages/Auth';
// import Users from './user/pages/Users';  <--going to lazy-load this instead.


const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
  const { jsonWebTokenState, userIdState, loginHandler, logoutHandler } = useAuth();

  const contextValue = {
    isLoggedIn: !!jsonWebTokenState,
    token: jsonWebTokenState,
    userId: userIdState,
    login: loginHandler,
    logout: logoutHandler
  };

  let routes;

  if (jsonWebTokenState) {
    routes = (
      <Switch>
        <Route exact path="/" render={() => <Users />} />
        <Route exact path="/:userId/places" render={(routeProps) => <UserPlaces {...routeProps} />} />
        <Route path="/places/new" render={() => <NewPlace />} />
        <Route path="/places/:placeId" render={() => <UpdatePlace />} />
        <Redirect to="/" />
      </Switch>)
  } else {
    routes = (
      <Switch>
        <Route exact path="/" render={() => <Users />} />
        <Route exact path="/:userId/places" render={(routeProps) => <UserPlaces {...routeProps} />} />
        <Route path="/auth" render={() => <Auth />} />
        <Redirect to="/auth" />
      </Switch>
    )
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <MainNavigation />
      <main>
        <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>{routes}</Suspense>
      </main>

    </AuthContext.Provider>
  );
}

export default App;
