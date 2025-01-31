// AboutPage.js
import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>About Us</h1>
      <p>
        Welcome to our application! Our platform is designed to simplify the way you browse,
        manage, and interact with listings. Whether you are buying, selling, or just exploring,
        our app provides a seamless and intuitive experience.
      </p>
      <h2>Our Mission</h2>
      <p>
        Our mission is to connect people and opportunities through a reliable and efficient
        platform. We aim to empower users by providing tools that make managing listings
        straightforward and effective.
      </p>
      <h2>Why Choose Us?</h2>
      <ul>
        <li>Easy-to-use interface for browsing and managing listings.</li>
        <li>Comprehensive search and filtering options to find exactly what you need.</li>
        <li>Secure platform ensuring your data and transactions are safe.</li>
        <li>Constant updates and improvements based on user feedback.</li>
      </ul>
      <h2>Meet the Team</h2>
      <p>
        Our dedicated team is passionate about creating a platform that meets your needs.
        With expertise in technology and a commitment to user satisfaction, we strive to
        deliver the best experience possible.
      </p>
      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? Feel free to <a href="/contact">contact us</a>. We'd love to hear from you!
      </p>
    </div>
  );
};

export default AboutPage;