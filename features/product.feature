Feature: Product Catalog System

  Scenario: Verify find products
    Given the system is running
    When I access the route products
    Then the system should return all products with HTTP code 200
