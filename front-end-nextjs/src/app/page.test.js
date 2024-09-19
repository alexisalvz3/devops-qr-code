import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './page';

describe('Home component', () => {
    test('renders without crashing', () => {
        // first we render the home component on our page.js
        render(<Home />);
        // then we query a button element with a specific text to test
        const button = screen.getByRole('button', { name: /Generate QR Code/i });
        // finally we assert (or test) that our expected button element is indeed rendered
        expect(button).toBeInTheDocument();
    })
})

// test that checks for the presence of the input field where users enter the URL
describe('Input field', () => {
    test('renders input field for URL', () => {
        // render Home component
        render(<Home />);
        // grab input field element by making sure placeholder text matches        
        const input = screen.getByPlaceholderText('Enter URL like https://example.com');
        // test input element presence
        expect(input).toBeInTheDocument();
    })
})

// test that checks for the presence of changes to the input field where users enter the URL
describe('Updates Input field', () => {
    test('updates input value when user types', async () => {
        // configuring and instance of a user-event
        const user = userEvent.setup()
        // render Home component
        render(<Home />);
        // grab input field element by making sure placeholder text matches
        const input = screen.getByPlaceholderText('Enter URL like https://example.com');
        // Use userEvent to type into the input
        await user.type(input, 'image.com');
        // check if the input's value has been updated
        expect(input).toHaveValue('image.com');
    })
})

describe('Generating QR image', () => {
    test('generates QR code when button is clicked', async () => {
        // Mock axios.post to return a fake QR code URL
        jest.spyOn(axios, 'post').mockResolvedValue({ data: { qr_code_url: 'http://fake-qr-code.png' } });
    
        const user = userEvent.setup()
        render(<Home />);
    
        // Find the input and button
        const input = screen.getByPlaceholderText('Enter URL like https://example.com');
        const button = screen.getByRole('button', { name: /Generate QR Code/i });

        // Type a URL into the input
        await user.type(input, 'qr-code-test.com');
        // Click the button
        await user.click(button)
        // Check if the QR code image appears
        const qrImage = await screen.findByRole('img');
        expect(qrImage).toBeInTheDocument();
        expect(qrImage).toHaveAttribute('src', 'http://fake-qr-code.png');
    })
})
    