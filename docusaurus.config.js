const path = require('path');

module.exports = {
  title: 'Fathym IoT Ensemble Beta',
  tagline: 'Experience IoT in minutes | No credit card required',
  url: 'https://www.iot-ensemble.com',
  baseUrl: '/iot/docs/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'iot-ensemble', // Usually your GitHub org/user name.
  projectName: 'public-web-docs', // Usually your repo name.
  themeConfig: {
    oribi: {
      trackingID: 'XzcwMzAwMzkyNA',
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'dark',
      // Hides the switch in the navbar. Useful if you want to support a single color mode
      disableSwitch: true,
    },
    navbar: {
      title: 'IoT Ensemble Beta',
      logo: {
        alt: 'IoT Ensemble',
        src: 'img/Fathym-logo-white-01.png',
      },
      items: [
        {
          href: 'https://www.iot-ensemble.com',
          label: 'Home',
          position: 'left',
          target: '_top',
        },
        // {
        //   href: 'https://www.iot-ensemble.com/dashboard',
        //   label: 'Sign Up',
        //   position: 'left',
        //   target: '_top',
        // },
        // {
        //   href: 'https://www.iot-ensemble.com/pricing',
        //   label: 'Pricing',
        //   position: 'right',
        //   target: '_top',
        // },
        {
          href: 'https://www.iot-ensemble.com/docs',
          label: 'Docs',
          position: 'right',
          target: '_top',
        },
        {
          href: 'https://www.iot-ensemble.com/blog',
          label: 'Blog',
          position: 'right',
          target: '_top',
        },
        {
          href: 'https://www.iot-ensemble.com/dashboard',
          label: 'Sign In',
          position: 'right',
          target: '_top',
        },
        {
          href: 'https://www.iot-ensemble.com/dashboard',
          label: 'Sign Up',
          position: 'right',
          target: '_top',
        }, 
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Next Steps',
          items: [
            {
              label: 'Getting Started',
              to: 'https://www.iot-ensemble.com/dashboard',
            },
            // {
            //   label: 'Pricing',
            //   to: 'https://www.iot-ensemble.com/pricing',
            // },
            {
              label: 'Support',
              to: '/introduction/support',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/iot-ensemble',
            },
            //{
            //  label: 'Discord',
            //  href: 'https://discordapp.com/invite/iot-ensemble',
            //},
            {
              label: 'Twitter',
              href: 'https://twitter.com/iotensemble',
            },
          ],
        },
        {
          title: 'Powered by Fathym',
          items: [
            {
              label: 'Learn More',
              href: 'https://www.fathym.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fathym, Inc`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // The iot-ensemble website repo
          // editUrl: 'https://github.com/iot-ensemble/public-web-docs/edit/master/website/',
        },
        gtag: {
          trackingID: 'G-NEWEXH7W8C',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {},
      },
    ],
  ],
  // plugins: [path.resolve(__dirname, 'plugins/oribi')],
};
