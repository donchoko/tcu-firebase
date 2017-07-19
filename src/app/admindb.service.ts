import { Injectable } from '@angular/core';
import * as admin from 'firebase-admin'

@Injectable()
export class AdmindbService {

  constructor() {
    

    admin.initializeApp({
      credential: admin.credential.cert(
        {
          projectId: 'tcu-firebase',
          privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgEJ7g66umaZLS\nWmSp0ncrqe4XKNUXMMtwGgjUTy2HGbEAmgfw+lOJbvokIIJN7ytZavqBeVqc8fLz\nbqgr4T4NqOU8uezlpn9YkABq6HPEoGsO+1rcZMcRA/jfQSkdSBC8PrVh8gZCLCJU\nmhOMG1nqCNKGkNPM15Ri2meIHy06VVXXyB1TwNL7auVCsbqNvaJSBdxF+f+62M/n\nJJAp2xW991fLhkxe0FgQs6X3U/b3osY47m0m1ogh+Pa1L+Sn4znNvh7ALCuh1mUf\nhasbdfy/HD6GAOGAtkU8WrYNGdi0IL4twHQ/CIP9bIeXVS54LQFbsQcA6hgBzXUO\nbJMJ/6JfAgMBAAECggEAArfTwfbpNthwjPAfk7R0kZsGc5ABgB/COC/HNprafNfv\nSYipaBVJ6zKld3B5cKeUZqWm21o3wXmhcTKW9rYDlDCxJaGCoMdEzP/Bc9ZpWb80\n9cGAt7ZFgHKw0eDUDll1mfWhUKh5srtNIQ1SFeDElFTSBX4TqONHZVgeVJ+kr6OK\nrRQ4Sl5gNImrKxoXlpswo3mVzKiDZxGgcFlmh5+tthPuiYPNPHPOvefuFuoQfmXr\n3HC/h9nPfzHAj2c7KLRnpOV6YQ80qK8O4FYnc3h+VYXixQOu/YJvbT5coGe8jHDP\nrZRJURruRMxeNwgPOvh82VKJRvFDTcabIBbYy1UNAQKBgQDRaaexDPfgjJwJhkMZ\nHUGGqHkIVJBjP8+ICccRR7S0euVEhqUZrrxmPiuT9gLprcFkAvaETPaBlCK23uun\nl39NtR7gFDuHmNyWwTufCFDGSolB+KYOytbyQIWnNXu3MkA0u0Cd0cH1MHVR6TB0\nR2JoMd8DrAsqGqCtX+/fUBI7AwKBgQDDrIpU4eCv7CC3D3cCMumsvHan+frF4Ve1\nAfOh0S6O93JXvcxssxwAjygSRV7jQ+gFPu1iyJhn2z/QVoTgP4T3c6k55XD2DdiU\nB0DlDkAyacnsI/+GX0HEVeZqus5E8U8G9HM1sqMfoTchRNPzkFhW6B8dXk5CXfF6\n5T25xKWOdQKBgQCWb7gv0IkhnuFZVkJNgF7aRZztBxLSubx0ldGT8Fc4cDDTkYZ5\ndLWTHYZgvJJLHK+ZESfW0xMi8zAc/vd7ZbHmOP79Kou5VW7iPd5+2JJuYI1J/z4L\n0lunnAJnpFxDtq25M+uvdEhJw44EUeilH8Lp5ym2kZlTnd1fr1O6sOLn0QKBgG9Q\n4eVGFs+d8kKSDq72jc8R7CLFaG9YMdAsixA8c1Mr3CWkOP6BqmV7C13RjxiVEhKh\n6OQwn9s9dIEuJyt3l0o6x0PDjk68M8CKm9VzFPxZCGFJXV1xJXXvNET1ftDjwoR/\nXmdm97vPuBA6GqXOMSNHrCPF+Zlx3iV+8m2TPGfdAoGAHinuOCM5LA7niOJSiOgA\nXJX4gIPoN3PfyfVMyyTpk5KM+57dJPtAQ76CqrUHMOL1K4DZWfW+PuHo65c3tJa3\nfWV4uBS5hD3lRlHj1XFWRgVjZ6oYlEvo3I/uokljyU5Y6IFrLAwQfABecgbKZgqH\nmfncJg20mVIiQqhXUrb1ERA=\n-----END PRIVATE KEY-----\n',
          clientEmail: 'firebase-adminsdk-2ny6v@tcu-firebase.iam.gserviceaccount.com',
        }
      ),
      databaseURL: 'https://tcu-firebase.firebaseio.com'
    });
  }

  createUser(email: string, pass: string) {
    var uid: string;
    admin.auth().createUser({
      email: email,
      password: pass,
      disabled: false
    }).then(function (userRecord) {
      uid = userRecord.uid;
    }).catch(function (error) {
      console.log("Error creating new user:", error);
    });

    if (uid != null || uid != "") {
      return uid;
    }
  }

}
