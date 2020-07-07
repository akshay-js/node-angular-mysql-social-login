// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   FaceBookId: "321183472241700",
//   endPoint: "http://lb-dev-1468148919.ca-central-1.elb.amazonaws.com/api/",
//   twitterLoginUrl: 'http://lb-dev-1468148919.ca-central-1.elb.amazonaws.com/api/auth/twitter',
//   twitterLinkUrl: 'http://lb-dev-1468148919.ca-central-1.elb.amazonaws.com/api/auth/twitterLink'
// };

export const environment = {
  production: false,
  FaceBookId: "321183472241700",
  endPoint: "http://localhost:4000/api/",
  twitterLoginUrl: 'http://localhost:4000/api/auth/twitter',
  twitterLinkUrl: 'http://localhost:4000/api/auth/twitterLink'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
