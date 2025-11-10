from unittest.mock import patch
import unittest
import time
from typing import Dict

import requests


############### Mock Time ############################
def get_timestamp() -> float:
    return time.time()


class TestGetTimestamp(unittest.TestCase):
    @patch(
        "time.time", return_value=1625097600.0
    )  # Mocking time.time to return a fixed timestamp
    def test_get_timestamp(self, mock_time) -> None:
        result = get_timestamp()  # Call the function with the mocked time function

        self.assertEqual(
            result, 1625097600.0
        )  # Assert the returned value is as expected
        mock_time.assert_called_once()  # Ensure the time method was called once


############### Mock HTTP Request ############################


def get_data(url: str) -> Dict[str, str]:
    response = requests.get(url)
    return response.json()


class TestGetData(unittest.TestCase):
    @patch("requests.get")
    def test_get_data(self, mock_get) -> None:
        mock_response = mock_get.return_value  # Create a mock response object
        mock_response.json.return_value = {
            "key": "value"
        }  # Define the return value of the mock response's json method

        url = "http://example.com/api"
        result = get_data(url)  # Call the function with the mocked response

        self.assertEqual(
            result, {"key": "value"}
        )  # Assert the returned value is as expected
        mock_get.assert_called_once_with(
            url
        )  # Ensure the get method was called once with the correct URL


############### Mock a Class ############################


class Database:
    def connect(self) -> None:
        pass

    def fetch_data(self) -> dict[str, str]:
        return {"data": "real data"}


def process_data() -> Dict[str, str]:
    db = Database()
    db.connect()
    return db.fetch_data()


class TestProcessData(unittest.TestCase):
    @patch("__main__.Database")
    def test_process_data(self, MockDatabase) -> None:
        # Create an instance of the mock Database class
        mock_db = MockDatabase.return_value
        # Define the return value of the fetch_data method
        mock_db.fetch_data.return_value = {"data": "mock data"}

        result = process_data()  # Call the function with the mocked Database

        # Assert the returned value is as expected
        self.assertEqual(result, {"data": "mock data"})
        mock_db.connect.assert_called_once()  # Ensure the connect method was called once


if __name__ == "__main__":
    unittest.main()
