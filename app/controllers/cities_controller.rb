class CitiesController < ApplicationController
  # Cities are a small lookup list. It is ordered and capped, so the response
  # stays stable and bounded instead of growing with the table.
  MAX_CITIES = 500

  # GET /cities
  def index
    render json: City.order(:name).limit(MAX_CITIES)
  end
end
