###############################################################################
######                            PROPERTIES                             ######
###############################################################################

CXX			= g++ -std=c++17 -g
RM			= rm -rf
MAKEFLAGS	= -j$(nproc) --no-print-directory

NAME		= beacon
SRCSDIR		= srcs
SRCS		= \
		${SRCSDIR}/data.cpp \
		${SRCSDIR}/algo.cpp \
		${SRCSDIR}/main.cpp

OBJSDIR		= objs
OBJS		= $(addprefix $(OBJSDIR)/, $(SRCS:.cpp=.o))

###############################################################################
######                               RULES                               ######
###############################################################################

all		: $(NAME)

$(NAME)	: ${OBJS}
		$(CXX) -o $@ $^

${OBJSDIR}/%.o	: %.cpp
		@mkdir -p $(dir $@)
		${CXX} -c $< -o $@

clean	:
		$(RM) $(OBJSDIR)

fclean	:
		$(RM) $(OBJSDIR) $(NAME)

re		:
		$(MAKE) fclean
		$(MAKE) all

run		:
		$(MAKE) re
		time ./$(NAME) "3 2" maps/easy.txt maps/easy.txt maps/easy.txt maps/easy.txt

.PHONY: all clean fclean re run
