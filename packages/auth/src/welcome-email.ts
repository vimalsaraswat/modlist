export const welcomeEmailHtml = (name: string, baseUrl: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MODLIST!</title>
      <style>
          body {
              margin: 0;
              padding: 0;
              font-family: 'Montserrat', sans-serif, Arial;
              color: hsl(346, 8%, 22%); /* --foreground */
              background-color: hsl(24, 100%, 98%); /* --background */
          }
          table {
              border-collapse: collapse;
              width: 100%;
          }
          td {
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: hsl(0, 0%, 100%); /* --card */
              border-radius: 1rem;
              box-shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09);
          }
          .header {
              text-align: center;
              padding: 2.5rem 0;
          }
          .header h1 {
              font-size: 2.5rem;
              font-weight: 700;
              color: hsl(11, 100%, 69%); /* --primary */
              margin: 0;
          }
          .content {
              padding: 0 2.5rem 2.5rem 2.5rem;
              line-height: 1.6;
          }
          .content p {
              font-size: 1rem;
              margin: 0 0 1rem;
          }
          .content h2 {
              font-size: 1.75rem;
              font-weight: 600;
              margin: 0 0 1rem;
              color: hsl(346, 8%, 22%);
          }
          .button {
              display: inline-block;
              background-color: hsl(11, 100%, 69%); /* --primary */
              color: hsl(0, 0%, 100%); /* --primary-foreground */
              padding: 1rem 2rem;
              text-decoration: none;
              border-radius: 0.625rem;
              font-weight: 600;
              font-size: 1rem;
              text-align: center;
          }
          .footer {
              text-align: center;
              padding: 2rem 0;
              font-size: 0.75rem;
              color: hsl(25, 5%, 45%); /* --muted-foreground */
          }
          .footer a {
              color: hsl(25, 5%, 45%);
              text-decoration: none;
          }
      </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif, Arial; background-color: hsl(24, 100%, 98%);">

      <!-- Main Container Table -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: hsl(24, 100%, 98%); width: 100%; padding: 2rem 0;">
          <tr>
              <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="container" style="max-width: 600px; background-color: hsl(0, 0%, 100%); border-radius: 1rem; box-shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09);">

                      <!-- Header -->
                      <tr>
                          <td class="header" style="text-align: center; padding: 2.5rem 0;">
                              <h1 style="font-size: 2.5rem; font-weight: 700; color: hsl(11, 100%, 69%); margin: 0;">MODLIST</h1>
                          </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                          <td class="content" style="padding: 0 2.5rem 2.5rem 2.5rem; line-height: 1.6;">
                              <h2 style="font-size: 1.75rem; font-weight: 600; margin: 0 0 1rem; color: hsl(346, 8%, 22%);">Welcome to MODLIST, ${name}.</h2>

                              <p style="font-size: 1rem; margin: 0 0 1rem;">
                                  We're excited to have you join our community. MODLIST is the ultimate peer-to-peer marketplace for car enthusiasts, designed to connect you with the perfect parts and mods for your build.
                              </p>

                              <p style="font-size: 1rem; margin: 0 0 1.5rem;">
                                  Whether you're hunting for a rare find or selling some gear, our platform is built to make the process simple and seamless. Your journey to finding or selling the perfect part starts now.
                              </p>

                              <p style="text-align: center;">
                                  <a href="${baseUrl}/listings" class="button" style="display: inline-block; background-color: hsl(11, 100%, 69%); color: hsl(0, 0%, 100%); padding: 1rem 2rem; text-decoration: none; border-radius: 0.625rem; font-weight: 600; font-size: 1rem; text-align: center;">Browse Listings</a>
                              </p>
                          </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                          <td class="footer" style="text-align: center; padding: 2rem 0; font-size: 0.75rem; color: hsl(25, 5%, 45%);">
                              <p style="margin: 0;">
                                  You received this email because you signed up for MODLIST.
                              </p>
                              <p style="margin: 0; padding-top: 0.5rem;">
                                  &copy; 2025 MODLIST. All rights reserved.
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
`;
};

export const welcomeEmailText = (name: string, baseUrl: string) => {
  return `
Welcome to MODLIST, ${name}.

We're excited to have you join our community. MODLIST is the ultimate peer-to-peer marketplace for car enthusiasts, designed to connect you with the perfect parts and mods for your build.

Whether you're hunting for a rare find or selling some gear, our platform is built to make the process simple and seamless. Your journey to finding or selling the perfect part starts now.

Browse Listings: ${baseUrl}/listings

You received this email because you signed up for MODLIST.
`;
};
