class ListingsController < ApplicationController
  DEFAULT_PER_PAGE = 50
  MAX_PER_PAGE = 100

  # GET /listings - one page of listings, newest first.
  def index
    listings = Listing.order(created_at: :desc, id: :desc)
                      .page(params[:page])
                      .per(per_page)

    render json: listings
  end

  private

  # Page size. ?per=0 or a bad value falls back to the default and a big value
  # is capped, so the response stays bounded.
  def per_page
    requested = params[:per].to_i
    return DEFAULT_PER_PAGE if requested <= 0

    [ requested, MAX_PER_PAGE ].min
  end
end
